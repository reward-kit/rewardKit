import { db } from "@rewardkit/packages/db/db";
import { ConflictError, NotFoundError } from "@rewardkit/packages/errors/app-error";
import { clerk } from "@rewardkit/packages/infra/clerk/clerk.config";
import { CheckSubdomainRequest, CheckSubdomainResponse, CreateProgramRequest, CreateProgramResponse, DeleteProgramRequest, DeleteProgramResponse, GetProgramByOrgIdRequest, GetProgramByOrgIdResponse, GetProgramRequest, GetProgramResponse, ListProgramsRequest, ListProgramsResponse, UpdateProgramRequest, UpdateProgramResponse } from "@rewardkit/packages/types/program/program.api.schema";
import { faviconService } from "./favicon.service";
import { s3StorageService } from "@rewardkit/packages/infra/aws/s3Storage";
import { after } from "next/server";
import { partnerGroupService } from "../../partner-groups/services/partner-groups.service";

const RESERVED_SUBDOMAINS = new Set([
    "www", "app", "api", "admin", "dashboard", "mail", "support", "docs", "blog", "status", "rewardkit", "admin", "console", "clerk", "status",
])

export class ProgramService {

    async createProgram({ userId, programData }: CreateProgramRequest): Promise<CreateProgramResponse> {
        const subdomain = programData.subdomain.toLowerCase()
        if (RESERVED_SUBDOMAINS.has(subdomain)) {
            throw new ConflictError("This subdomain is reserved. Pick another.")
        }

        let organization
        try {
            organization = await clerk.organizations.createOrganization({
                name: programData.productName,
                slug: subdomain,
                createdBy: userId,
            })
        } catch (err: any) {
            if (err?.status === 422) throw new ConflictError("This subdomain was just taken. Pick another.")
            throw err
        }

        let program
        try {
            await db.organization.create({
                orgId: organization.id,
                name: organization.name,
                slug: organization.slug,
                imageUrl: organization.imageUrl,
            })
            program = await db.program.create({
                ...programData,
                subdomain,
                orgId: organization.id,
                userId,
                faviconUrl: "", // filled in below, after the response is sent
            })
        } catch (err) {
            // otherwise the Clerk org keeps the subdomain and the user can't retry with it
            await this.teardownOrganization(organization.id).catch((e) =>
                console.error("[createProgram] cleanup failed", e)
            )
            throw err
        }

        await Promise.all([
            clerk.users.updateUser(userId, { publicMetadata: { onboardingComplete: true } }),
            db.user.updateOne({ userId }, { $set: { isOnboardingCompleted: true } }),
        ])

        // runs after the response is sent, so the user never waits for it
        after(async () => {
            try {
                const group = await partnerGroupService.createPartnerGroup({ orgId: organization.id, userId, groupData: { name: "Default" } })
                const { key } = await faviconService.save({
                    orgId: organization.id,
                    websiteUrl: programData.websiteUrl,
                    name: programData.productName,
                })
                await db.program.updateOne({ _id: program._id }, { $set: { faviconUrl: key, defaultGroupId: group.partnerGroup.id } })
            } catch (err) {
                console.error("[createProgram] favicon save failed", err)
            }
        })

        return { success: true, message: "Program created successfully", program }
    }

    async getProgram(getProgramData: GetProgramRequest): Promise<GetProgramResponse> {
        const program = await db.program.findById(getProgramData.programId);
        if (!program) {
            throw new NotFoundError("Program not found");
        }
        return { success: true, message: "Program retrieved successfully", program };
    }

    async getProgramByOrgId(getProgramData: GetProgramByOrgIdRequest): Promise<GetProgramByOrgIdResponse> {
        const program = await db.program.findOne({ orgId: getProgramData.orgId });
        if (!program) {
            throw new NotFoundError("Program not found");
        }
        return { success: true, message: "Program retrieved successfully", program };
    }

    async listPrograms({ userId }: ListProgramsRequest): Promise<ListProgramsResponse> {
        const programs = await db.program.aggregate([
            { $match: { userId } },
            { $sort: { createdAt: 1 } },
            {
                $lookup: {
                    from: db.organization.collection.name, // the real collection name, so no typo
                    let: { orgId: "$orgId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$orgId", "$$orgId"] } } },
                        { $project: { _id: 0, orgId: 1, name: 1, slug: 1, imageUrl: 1 } },
                    ],
                    as: "organization",
                },
            },
            {
                $set: {
                    // $lookup always returns an array: take the first match, or null if there is none
                    organization: { $ifNull: [{ $first: "$organization" }, null] },
                    // aggregate() returns raw documents: no virtuals and no ObjectId-to-string
                    _id: { $toString: "$_id" },
                    id: { $toString: "$_id" },
                },
            },
        ])

        return { success: true, message: "Programs retrieved successfully", programs };
    }

    async updateProgram(updateProgramData: UpdateProgramRequest): Promise<UpdateProgramResponse> {
        const updatedProgram = await db.program.findOneAndUpdate(
            { _id: updateProgramData.programId },
            { $set: updateProgramData.programData },
            { returnDocument: "after", runValidators: true }
        ).lean();

        if (!updatedProgram) {
            throw new Error("Program not found");
        }

        return { success: true, message: "Program updated successfully", program: updatedProgram };
    }

    private async teardownOrganization(orgId: string) {
        // 1. Files
        await s3StorageService.deleteAllForOwner({ orgId })

        // 2. Clerk org, which frees the slug/subdomain. Already gone is fine
        try {
            await clerk.organizations.deleteOrganization(orgId)
        } catch (err: any) {
            if (err?.status !== 404) throw err
        }

        // 3. Our mirror of the org
        await db.organization.deleteOne({ orgId })

        // TODO: other collections that carry orgId (partners, referrals, payouts, ...)
        // await db.partner.deleteMany({ orgId })
    }

    async deleteProgram({ programId, userId }: DeleteProgramRequest): Promise<DeleteProgramResponse> {
        const program = await db.program.findById(programId)

        // same error for "missing" and "not yours", so ids can't be probed
        if (!program || program.userId !== userId) throw new NotFoundError("Program not found")

        // each program has its own org, but never tear an org down while another program still uses it
        const orgInUse = await db.program.exists({ orgId: program.orgId, _id: { $ne: program._id } })
        if (!orgInUse && program.orgId) await this.teardownOrganization(program?.orgId)

        // program row LAST: while it exists, a failed delete can simply be retried
        await Promise.all([
            db.program.deleteOne({ _id: program._id }),
            db.partnerGroup.deleteMany({ orgId: program.orgId })
        ])

        // that was their last program: send them back through onboarding
        if (!(await db.program.exists({ userId }))) {
            await Promise.all([
                clerk.users.updateUser(userId, { publicMetadata: { onboardingComplete: false } }),
                db.user.updateOne({ userId }, { $set: { isOnboardingCompleted: false } }),
            ])
        }

        return { success: true, message: "Program deleted successfully" }
    }

    async checkSubdomainAvailability({ subdomain }: CheckSubdomainRequest): Promise<CheckSubdomainResponse> {

        const slug = subdomain.toLowerCase()

        if (RESERVED_SUBDOMAINS.has(slug)) {
            return { success: true, available: false, reason: "reserved" }
        }

        // 1. Your DB first: cheap, and it's what runs on every debounced keystroke
        if (await db.organization.exists({ slug })) {
            return { success: true, available: false, reason: "taken" }
        }

        // 2. Clerk is the source of truth for slugs. getOrganization throws a 404 when none exists
        try {
            await clerk.organizations.getOrganization({ slug })
            return { success: true, available: false, reason: "taken" }
        } catch (err: any) {
            if (err?.status !== 404) throw err // a real failure, not "not found"
        }

        return { success: true, available: true, reason: null }
    }
}

export const programService = new ProgramService();