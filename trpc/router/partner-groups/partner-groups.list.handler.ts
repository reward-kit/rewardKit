import { partnerGroupService } from "@rewardkit/packages/features/partner-groups/services/partner-groups.service"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type ListPartnerGroup = {
    ctx: ContextProps
}

export async function listPartnerGroup({ ctx }: ListPartnerGroup) {
    const { orgId } = await assertOrgMember({ ctx })
    const program = await partnerGroupService.listPartnerGroups({ orgId })
    return { ...program }
}