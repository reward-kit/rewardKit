import { partnerGroupService } from "@rewardkit/packages/features/partner-groups/services/partner-groups.service"
import { CreatePartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type CreatePartnerGroup = {
    ctx: ContextProps
    input: CreatePartnerGroupInput
}

export async function createPartnerGroup({ ctx, input }: CreatePartnerGroup) {
    const { userId, orgId } = await assertOrgMember({ ctx })
    const program = await partnerGroupService.createPartnerGroup({ userId, orgId, groupData: input.groupData })
    return { ...program }
}