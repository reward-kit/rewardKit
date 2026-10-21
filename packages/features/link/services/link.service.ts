import { db } from "@rewardkit/packages/db/db"
import { AppError } from "@rewardkit/packages/errors/app-error"
import { LINK_STATUS, type LinkResource } from "@rewardkit/packages/types/link/link.schema"
import { URL_PARAMETER, UrlParameter } from "@rewardkit/packages/types/program/program.schema"
import {
    type CreateLinkRequest, type CreateLinkResponse,
    type DeleteLinkRequest, type DeleteLinkResponse,
    type GetLinkRequest, type GetLinkResponse,
    type LinkListItem,
    type ListLinksRequest, type ListLinksResponse,
    type UpdateLinkRequest, type UpdateLinkResponse,
} from "@rewardkit/packages/types/link/link.api.schema"
import { allowedUrlParams, buildLinkUrl, generateLinkCode, linkStatsFromSeed, resolveUrlParam } from "../lib/link.lib"
import type { LinkStats } from "@rewardkit/packages/types/link/link.api.schema"

const DUPLICATE_KEY = 11000
// only stored fields can be sorted by the database; metrics sort client-side
const SORTABLE = new Set(["createdAt", "code"])
const STATUS_BY_CODE = { NOT_FOUND: 404, CONFLICT: 409, BAD_REQUEST: 400 } as const
// every field needed to build a link's url / resolve its parameter
const PROGRAM_URL_FIELDS = "subdomain websiteUrl urlParams"

type LinkUrlSource = { websiteUrl?: string | null; subdomain?: string | null; urlParams?: UrlParameter[] | null }

export class LinkServiceError extends AppError {
    constructor(
        public code: "NOT_FOUND" | "CONFLICT" | "BAD_REQUEST",
        message: string,
    ) {
        super(message, STATUS_BY_CODE[code], code)
        this.name = "LinkServiceError"
    }
}

export class LinkService {

    async create({ orgId, partnerId, linkData }: CreateLinkRequest): Promise<CreateLinkResponse> {
        // one round trip for both lookups instead of two sequential ones
        const [program, partner] = await Promise.all([
            db.program.findOne({ orgId }).select("_id " + PROGRAM_URL_FIELDS).lean(),
            db.partner.findOne({ _id: partnerId, orgId }).select("firstName lastName").lean(),
        ])
        if (!program) throw new LinkServiceError("NOT_FOUND", "Program not found")
        if (!partner) throw new LinkServiceError("NOT_FOUND", "Partner not found")

        const requested = linkData?.code
        const urlParam = this.resolveRequestedParam(linkData?.urlParam, program.urlParams)
        const fallbackName = `${partner.firstName ?? ""} ${partner.lastName ?? ""}`.trim() || "link"

        // a generated code can theoretically collide, so retry a couple of times;
        // a code the user typed is never retried - they get the conflict back
        let doc: LinkResource | null = null
        for (let attempt = 0; attempt < 3; attempt++) {
            const code = requested ?? generateLinkCode(fallbackName)
            try {
                doc = await db.link.create({
                    orgId,
                    programId: String(program._id),
                    partnerId,
                    code,
                    urlParam,
                    status: linkData?.status ?? LINK_STATUS.ACTIVE,
                })
                break
            } catch (err) {
                if (this.isDuplicate(err) && !requested && attempt < 2) continue
                this.rethrowDuplicate(err)
                throw err
            }
        }
        if (!doc) throw new LinkServiceError("CONFLICT", "Could not generate a unique link, please try again")

        return { success: true, message: "Link created successfully", link: this.toItem(doc as unknown as Record<string, any>, program, this.buildStats(0)) }
    }

    async get({ orgId, partnerId, linkId }: GetLinkRequest): Promise<GetLinkResponse> {
        const [program, doc, clicks] = await Promise.all([
            db.program.findOne({ orgId }).select(PROGRAM_URL_FIELDS).lean(),
            db.link.findOne({ _id: linkId, orgId, partnerId }).lean(),
            this.clickCounts(partnerId, [linkId]),
        ])
        if (!doc) throw this.notFound()
        return {
            success: true,
            message: "Link retrieved successfully",
            link: this.toItem(doc, program, this.buildStats(clicks.get(String(doc._id)))),
        }
    }

    // Optimised for the partner details tab: the DB does match/sort/skip/limit on
    // the orgId+partnerId index, and metrics are only computed for the page we return.
    async list({
        orgId, partnerId, status, search, page, limit, sortBy, desc,
    }: ListLinksRequest): Promise<ListLinksResponse> {
        const pageN = Math.max(1, Math.floor(page) || 1)
        const limitN = Math.min(Math.max(Math.floor(limit) || 20, 1), 100)
        const sortField = sortBy && SORTABLE.has(sortBy) ? sortBy : "createdAt"
        const dir = (desc ?? true) ? -1 : 1

        const filter = this.buildFilter({ orgId, partnerId, status, search })

        const [program, docs, total] = await Promise.all([
            db.program.findOne({ orgId }).select(PROGRAM_URL_FIELDS).lean(),
            db.link
                .aggregate([
                    { $match: filter },
                    { $sort: { [sortField]: dir, _id: dir } },
                    { $skip: (pageN - 1) * limitN },
                    { $limit: limitN },
                    {
                        $project: {
                            orgId: 1, programId: 1, partnerId: 1,
                            code: 1, urlParam: 1, status: 1, createdAt: 1, updatedAt: 1,
                        },
                    },
                ])
                .option({ maxTimeMS: 5000 }),
            db.link.countDocuments(filter),
        ])

        const clicks = await this.clickCounts(partnerId, docs.map((d: any) => String(d._id)))

        const totalPages = Math.max(1, Math.ceil(total / limitN))

        return {
            success: true,
            message: "Links retrieved successfully",
            data: docs.map((doc: any) =>
                this.toItem(doc, program, this.buildStats(clicks.get(String(doc._id)))),
            ),
            total,
            page: pageN,
            limit: limitN,
            totalPages,
            hasNextPage: pageN < totalPages,
            hasPrevPage: pageN > 1,
        }
    }

    async update({ orgId, partnerId, linkId, linkData }: UpdateLinkRequest): Promise<UpdateLinkResponse> {
        const program = await db.program.findOne({ orgId }).select(PROGRAM_URL_FIELDS).lean()

        // only validate against the program when the caller is changing the parameter
        const $set: Record<string, unknown> = { ...linkData }
        if (linkData.urlParam !== undefined) {
            $set.urlParam = this.resolveRequestedParam(linkData.urlParam, program?.urlParams)
        }

        let doc
        try {
            doc = await db.link.findOneAndUpdate(
                { _id: linkId, orgId, partnerId },
                { $set },
                { returnDocument: "after", runValidators: true },
            ).lean()
        } catch (err) {
            this.rethrowDuplicate(err)
            throw err
        }
        if (!doc) throw this.notFound()

        const clicks = await this.clickCounts(partnerId, [linkId])

        return { success: true, message: "Link updated successfully", link: this.toItem(doc, program, this.buildStats(clicks.get(String(doc._id)))), }
    }

    async delete({ orgId, partnerId, linkId }: DeleteLinkRequest): Promise<DeleteLinkResponse> {
        const res = await db.link.deleteOne({ _id: linkId, orgId, partnerId })
        if (res.deletedCount === 0) throw this.notFound()
        return { success: true, message: "Link deleted successfully" }
    }

    // helpers

    private buildFilter({
        orgId, partnerId, status, search,
    }: {
        orgId: string
        partnerId: string
        status?: ListLinksRequest["status"]
        search?: string
    }): Record<string, unknown> {
        const filter: Record<string, unknown> = { orgId, partnerId }
        if (status) filter.status = status
        const term = search?.trim()
        if (term) filter.code = new RegExp(this.escapeRegex(term), "i")
        return filter
    }

    private async clickCounts(partnerId: string, linkIds: string[]): Promise<Map<string, number>> {
        if (linkIds.length === 0) return new Map()
        const rows: { _id: string; count: number }[] = await db.click
            .aggregate([
                { $match: { partnerId, linkId: { $in: linkIds } } },
                { $group: { _id: "$linkId", count: { $sum: 1 } } },
            ])
            .option({ maxTimeMS: 5000 })
        return new Map(rows.map((r) => [String(r._id), r.count]))
    }

    private buildStats(clicks: number | undefined): LinkStats {
        return {
            total_clicks: clicks ?? 0,
            total_customers: 0,
            total_revenue: 0,
            total_commission: 0,
        }
    }

    // Accepts both a mongoose doc's toJSON() and a raw aggregation result.
    private toItem(
        raw: Record<string, any>,
        program: LinkUrlSource | null | undefined,
        stats: LinkStats,
    ): LinkListItem {
        const id = String(raw._id ?? raw.id ?? "")
        const urlParam = raw.urlParam ?? resolveUrlParam(undefined, program?.urlParams)
        return {
            _id: id,
            id,
            orgId: raw.orgId,
            programId: String(raw.programId ?? ""),
            partnerId: String(raw.partnerId ?? ""),
            code: raw.code,
            urlParam,
            status: raw.status,
            createdAt: this.toISO(raw.createdAt),
            updatedAt: this.toISO(raw.updatedAt),
            url: buildLinkUrl(program, raw.code, urlParam),
            ...stats,
        }
    }

    // Picks a valid parameter for a link, rejecting ones the program does not allow.
    private resolveRequestedParam(requested: UrlParameter | null | undefined, allowed: UrlParameter[] | null | undefined): UrlParameter {
        const list = allowedUrlParams(allowed)
        if (!requested) return list[0] ?? URL_PARAMETER.REF
        if (!list.includes(requested)) {
            throw new LinkServiceError("BAD_REQUEST", "This URL parameter is not allowed for this program")
        }
        return requested
    }

    private toISO(value: unknown): string | undefined {
        if (!value) return undefined
        if (value instanceof Date) return value.toISOString()
        return String(value)
    }

    private isDuplicate(err: unknown) {
        return typeof err === "object" && err !== null && (err as { code?: number }).code === DUPLICATE_KEY
    }

    private notFound() {
        return new LinkServiceError("NOT_FOUND", "Link not found")
    }

    private rethrowDuplicate(err: unknown) {
        if (this.isDuplicate(err)) {
            throw new LinkServiceError("CONFLICT", "This link code is already taken. Try another one.")
        }
    }

    private escapeRegex(s: string) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }
}

export const linkService = new LinkService()
