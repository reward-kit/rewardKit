import { partnerGroupService } from "@rewardkit/packages/features/partner-groups/services/partner-groups.service"
import { UpdatePartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type UpdatePartnerGroup = {
    ctx: ContextProps
    input: UpdatePartnerGroupInput
}

export async function updatePartnerGroup({ ctx, input }: UpdatePartnerGroup) {
    const { orgId } = await assertOrgMember({ ctx })
    const program = await partnerGroupService.updatePartnerGroup({ orgId, ...input })
    return { ...program }
}