import { PARTNER_STATUS, PartnerStatus, type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import type {
    CreatePartnerRequest,
    GetPartnerRequest,
    UpdatePartnerRequest,
    ListPartnersRequest,
    ListPartnersResponse,
    ChangePartnerStatusRequest,
    DeletePartnerRequest,
    PartnerStatusCounts,
    PartnerCountsRequest,
    PartnerWithStats,
} from "@rewardkit/packages/types/partner/partner.api.schema"
import { db } from "@rewardkit/packages/db/db"
import { visitorService } from "@rewardkit/packages/features/tracking/services/visitor.service"
import { clickService } from "@rewardkit/packages/features/tracking/services/click.service"

import { AppError } from "@rewardkit/packages/errors/app-error"

const STATUS_BY_CODE = { NOT_FOUND: 404, CONFLICT: 409, BAD_REQUEST: 400 } as const
const SORTABLE = new Set(["createdAt", "firstName", "email", "status"])

export class PartnerServiceError extends AppError {
    constructor(
        public code: "NOT_FOUND" | "CONFLICT" | "BAD_REQUEST",
        message: string,
    ) {
        super(message, STATUS_BY_CODE[code], code)
        this.name = "PartnerServiceError"
    }
}

const GROUP_LOOKUP: any[] = [
    {
        $lookup: {
            from: "partner_group", // or db.partnerGroup.collection.name
            localField: "groupId",
            foreignField: "_id",
            as: "group",
            pipeline: [
                { $project: { name: 1, description: 1, default: 1, isPrivate: 1 } },
            ],
        },
    },
    { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
]

export class PartnerService {
    //Create
    async create({ orgId, partnerData }: CreatePartnerRequest): Promise<PartnerResource> {
        const groupId = partnerData.groupId
            ? await this.assertGroupInOrg(orgId, partnerData.groupId)
            : await this.getDefaultGroupId(orgId) // may be undefined, that's fine

        try {
            const doc = await db.partner.create({
                ...partnerData,
                ...(groupId ? { groupId } : {}),
                orgId,
                status: partnerData.status ?? PARTNER_STATUS.ACTIVE,
            })
            return this.toResource(doc)
        } catch (err) {
            this.rethrowDuplicate(err)
            throw err
        }
    }

    async get({ orgId, partnerId }: GetPartnerRequest): Promise<PartnerResource & { total_visitors: number, total_clicks: number }> {
        const [raw] = await db.partner
            .aggregate([
                { $match: { _id: partnerId, orgId } },
                { $limit: 1 },
                ...GROUP_LOOKUP,
            ])
            .option({ maxTimeMS: 5000 })

        if (!raw) throw this.notFound()

        const doc = db.partner.hydrate(raw)
        // hydrate drops fields that aren't in the partner schema, so re-attach the joined group
        const resource = this.toResource(doc) as PartnerResource & { group?: unknown }
        resource.group = raw.group ?? null

        // Visitor/click totals: computed by their own services (aggregation lives there),
        // both in one Promise.all so details stays two queries regardless of payload size.
        const programId = await this.resolveProgramId(orgId)
        const [visitorStats, clickStats] = await Promise.all([
            visitorService.getStatsByPartner(programId, partnerId),
            clickService.getStatsByPartner(programId, partnerId),
        ])
        return {
            ...resource,
            total_visitors: visitorStats.total_visitors,
            total_clicks: clickStats.total_clicks,
        }
    }

    /** One program per org (same rule programService.getProgramByOrgId uses); "" means no stats to compute. */
    private async resolveProgramId(orgId: string): Promise<string> {
        const program = await db.program.findOne({ orgId }, { _id: 1 }).lean()
        return program?._id ? String(program._id) : ""
    }

    // Update (profile fields only)
    async update({ orgId, partnerId, partnerData }: UpdatePartnerRequest): Promise<PartnerResource> {
        if (partnerData.groupId) await this.assertGroupInOrg(orgId, partnerData.groupId)

        try {
            const doc = await db.partner.findOneAndUpdate(
                { _id: partnerId, orgId },
                { $set: partnerData },
                { returnDocument: "after", runValidators: true },
            )
            if (!doc) throw this.notFound()
            return this.toResource(doc)
        } catch (err) {
            this.rethrowDuplicate(err)
            throw err
        }
    }

    // List
    async list({
        orgId, groupId, status, search, page, limit, sortBy, desc,
    }: ListPartnersRequest): Promise<ListPartnersResponse> {
        const pageN = Math.max(1, Math.floor(page) || 1)
        const limitN = Math.min(Math.max(Math.floor(limit) || 20, 1), 100)
        const sortField = sortBy && SORTABLE.has(sortBy) ? sortBy : "createdAt"
        const dir = desc ? -1 : 1

        const partnerProjection = {
            orgId: 1,
            groupId: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            companyName: 1,
            countryCode: 1,
            tags: 1,
            status: 1,
            payoutMethod: 1,
            rejectedReason: 1,
            rejectedAt: 1,
            suspendedReason: 1,
            suspendedAt: 1,
            createdAt: 1,
            updatedAt: 1,
            group: 1,
        }

        const filter = this.buildFilter({ orgId, groupId, status, search })

        const [docs, total] = await Promise.all([
            db.partner
                .aggregate([
                    { $match: filter },
                    { $sort: { [sortField]: dir, _id: dir } },
                    { $skip: (pageN - 1) * limitN },
                    { $limit: limitN },
                    ...GROUP_LOOKUP,          // now runs on at most `limitN` docs
                    { $project: partnerProjection },
                ])
                .option({ maxTimeMS: 5000 }),
            db.partner.countDocuments(filter),
        ])

        const totalPages = Math.max(1, Math.ceil(total / limitN))

        // Stats come from their own services: one grouped aggregation per
        // collection (not per partner), both running in parallel.
        const partnerIds = docs.map((d) => d._id)
        const programId = await this.resolveProgramId(orgId)
        const [visitorCounts, clickCounts] = await Promise.all([
            visitorService.getCountsByPartnerIds(programId, partnerIds),
            clickService.getCountsByPartnerIds(programId, partnerIds),
        ])
        const data: PartnerWithStats[] = docs.map((d) => ({
            ...d,
            total_visitors: visitorCounts.get(d._id) || 0,
            total_clicks: clickCounts.get(d._id) || 0,
        }))

        return {
            data: data as any,
            total,
            page: pageN,
            limit: limitN,
            totalPages,
            hasNextPage: pageN < totalPages,
            hasPrevPage: pageN > 1,
        }
    }

    // Counts (per status, honouring the filters that are independent of status)
    async counts({ orgId, groupId, search }: PartnerCountsRequest): Promise<PartnerStatusCounts> {
        const filter = this.buildFilter({ orgId, groupId, search })

        const rows = await db.partner
            .aggregate<{ _id: PartnerStatus; count: number }>([
                { $match: filter },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ])
            .option({ maxTimeMS: 5000 })

        const counts: PartnerStatusCounts = {
            active: 0,
            pending: 0,
            invited: 0,
            suspended: 0,
            rejected: 0,
        }
        for (const row of rows) {
            if (row._id in counts) counts[row._id] = row.count
        }
        return counts
    }

    // Change status
    async changeStatus({ orgId, partnerId, change }: ChangePartnerStatusRequest): Promise<PartnerResource> {
        const existing = await db.partner.findOne({ _id: partnerId, orgId })
        if (!existing) throw this.notFound()

        if (existing.status === change.status) {
            throw new PartnerServiceError("BAD_REQUEST", `Partner is already ${change.status}`)
        }

        const now = new Date()
        // reset both blocks, then set the one that applies
        const update: Record<string, unknown> = {
            status: change.status,
            rejectedAt: null,
            rejectedReason: null,
            suspendedAt: null,
            suspendedReason: null,
        }
        if (change.status === PARTNER_STATUS.REJECTED) {
            update.rejectedAt = now
            update.rejectedReason = change.reason
        }
        if (change.status === PARTNER_STATUS.SUSPENDED) {
            update.suspendedAt = now
            update.suspendedReason = change.reason
        }

        const doc = await db.partner.findOneAndUpdate(
            // including the old status makes this safe against two admins acting at once
            { _id: partnerId, orgId, status: existing.status },
            { $set: update },
            { new: true, runValidators: true },
        )
        if (!doc) throw new PartnerServiceError("CONFLICT", "Partner status changed, please retry")
        return this.toResource(doc)
    }

    // Delete
    async delete({ orgId, partnerId }: DeletePartnerRequest): Promise<void> {
        const res = await db.partner.deleteOne({ _id: partnerId, orgId })
        if (res.deletedCount === 0) throw this.notFound()
    }

    // helpers
    private buildFilter({
        orgId,
        groupId,
        status,
        search,
    }: {
        orgId: string
        groupId?: string
        status?: PartnerStatus
        search?: string
    }): Record<string, unknown> {
        const filter: Record<string, unknown> = { orgId }
        if (groupId) filter.groupId = groupId
        if (status) filter.status = status

        const term = search?.trim()
        if (term) {
            const rx = new RegExp(this.escapeRegex(term), "i")
            filter.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }]
        }
        return filter
    }

    private async assertGroupInOrg(orgId: string, groupId: string): Promise<string> {
        const group = await db.partnerGroup.exists({ _id: groupId, orgId })
        if (!group) throw new PartnerServiceError("BAD_REQUEST", "Group not found in this organization")
        return groupId
    }

    // used when the payload has no groupId
    private async getDefaultGroupId(orgId: string): Promise<string | null | undefined> {
        const program = await db.program.findOne({ orgId }).select("defaultGroupId").lean()
        return program?.defaultGroupId
    }

    private toResource(doc: { toJSON(): unknown }): PartnerResource {
        return doc.toJSON() as unknown as PartnerResource
    }

    private notFound() {
        return new PartnerServiceError("NOT_FOUND", "Partner not found")
    }

    private rethrowDuplicate(err: unknown) {
        if (typeof err === "object" && err !== null && (err as { code?: number }).code === 11000) {
            throw new PartnerServiceError("CONFLICT", "A partner with this email already exists")
        }
    }

    private escapeRegex(s: string) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }
}

export const partnerService = new PartnerService()