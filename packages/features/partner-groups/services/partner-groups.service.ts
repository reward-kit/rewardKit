import { db } from "@rewardkit/packages/db/db";
import { ConflictError, NotFoundError } from "@rewardkit/packages/errors/app-error";
import {
    CreatePartnerGroupRequest, CreatePartnerGroupResponse,
    DeletePartnerGroupRequest, DeletePartnerGroupResponse,
    GetPartnerGroupRequest, GetPartnerGroupResponse,
    ListPartnerGroupsRequest, ListPartnerGroupsResponse,
    SetDefaultPartnerGroupRequest, SetDefaultPartnerGroupResponse,
    UpdatePartnerGroupRequest, UpdatePartnerGroupResponse,
} from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema";

const DUPLICATE_KEY = 11000

export class PartnerGroupService {

    // every query below is scoped by orgId, so "missing" and "not yours"
    // are the same NotFoundError and ids can't be probed across orgs
    private async getProgram(orgId: string) {
        const program = await db.program.findOne({ orgId })
        if (!program) throw new NotFoundError("Program not found")
        return program
    }

    private async getGroup(partnerGroupId: string, orgId: string) {
        const group = await db.partnerGroup.findOne({ _id: partnerGroupId, orgId })
        if (!group) throw new NotFoundError("Partner group not found")
        return group
    }

    async createPartnerGroup({ orgId, userId, groupData }: CreatePartnerGroupRequest): Promise<CreatePartnerGroupResponse> {
        const program = await this.getProgram(orgId)

        // the first group in an org becomes its default
        const isFirst = !(await db.partnerGroup.exists({ orgId }))

        let partnerGroup
        try {
            partnerGroup = await db.partnerGroup.create({
                ...groupData,
                orgId,
                programId: program._id,
                createdBy: userId, // userId is only "who created it"
                default: isFirst,
            })
        } catch (err: any) {
            if (err?.code === DUPLICATE_KEY) throw new ConflictError("A group with this name already exists.")
            throw err
        }

        if (isFirst) {
            await db.program.updateOne({ _id: program._id }, { $set: { defaultGroupId: partnerGroup._id } })
        }

        return { success: true, message: "Partner group created successfully", partnerGroup }
    }

    async getPartnerGroup({ partnerGroupId, orgId }: GetPartnerGroupRequest): Promise<GetPartnerGroupResponse> {
        const partnerGroup = await this.getGroup(partnerGroupId, orgId)
        return { success: true, message: "Partner group retrieved successfully", partnerGroup }
    }

    async listPartnerGroups({ orgId }: ListPartnerGroupsRequest): Promise<ListPartnerGroupsResponse> {
        // default group first, then oldest first
        const partnerGroups = await db.partnerGroup
            .find({ orgId })
            .sort({ default: -1, createdAt: 1 })

        return { success: true, message: "Partner groups retrieved successfully", partnerGroups }
    }

    async updatePartnerGroup({ partnerGroupId, orgId, groupData }: UpdatePartnerGroupRequest): Promise<UpdatePartnerGroupResponse> {
        let partnerGroup
        try {
            partnerGroup = await db.partnerGroup.findOneAndUpdate(
                { _id: partnerGroupId, orgId },
                { $set: groupData },
                { returnDocument: "after", runValidators: true }
            ).lean()
        } catch (err: any) {
            if (err?.code === DUPLICATE_KEY) throw new ConflictError("A group with this name already exists.")
            throw err
        }

        if (!partnerGroup) throw new NotFoundError("Partner group not found")

        return { success: true, message: "Partner group updated successfully", partnerGroup }
    }

    async setDefaultPartnerGroup({ partnerGroupId, orgId }: SetDefaultPartnerGroupRequest): Promise<SetDefaultPartnerGroupResponse> {
        const group = await this.getGroup(partnerGroupId, orgId)

        const session = await db.partnerGroup.startSession()
        let partnerGroup
        try {
            await session.withTransaction(async () => {
                partnerGroup = await db.partnerGroup.findOneAndUpdate(
                    { _id: group._id, orgId },
                    { $set: { default: true } },
                    { returnDocument: "after", session }
                ).lean()

                await db.partnerGroup.updateMany(
                    { orgId, _id: { $ne: group._id } },
                    { $set: { default: false } },
                    { session }
                )

                await db.program.updateOne(
                    { orgId },
                    { $set: { defaultGroupId: group._id } },
                    { session }
                )
            })
        } finally {
            await session.endSession()
        }

        return { success: true, message: "Default partner group updated successfully", partnerGroup: partnerGroup! }
    }

    async deletePartnerGroup({ partnerGroupId, orgId }: DeletePartnerGroupRequest): Promise<DeletePartnerGroupResponse> {
        const group = await this.getGroup(partnerGroupId, orgId)

        if (group.default) {
            throw new ConflictError("The default group can't be deleted. Make another group the default first.")
        }

        // TODO: move this group's partners to the default group before deleting
        // await db.partner.updateMany({ orgId, groupId: group._id }, { $set: { groupId: program.defaultGroupId } })

        await db.partnerGroup.deleteOne({ _id: group._id, orgId })

        return { success: true, message: "Partner group deleted successfully" }
    }
}

export const partnerGroupService = new PartnerGroupService();