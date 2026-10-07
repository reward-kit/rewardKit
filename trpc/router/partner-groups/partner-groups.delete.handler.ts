import { partnerGroupService } from "@rewardkit/packages/features/partner-groups/services/partner-groups.service"
import { DeletePartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type DeletePartnerGroup = {
    ctx: ContextProps
    input: DeletePartnerGroupInput
}

export async function deletePartnerGroup({ ctx, input }: DeletePartnerGroup) {
    const { orgId } = await assertOrgMember({ ctx })
    const program = await partnerGroupService.deletePartnerGroup({ orgId, partnerGroupId: input.partnerGroupId })
    return { ...program }
}