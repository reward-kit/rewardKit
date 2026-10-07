import { partnerGroupService } from "@rewardkit/packages/features/partner-groups/services/partner-groups.service"
import { SetDefaultPartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type SetDefaultPartnerGroup = {
    ctx: ContextProps
    input: SetDefaultPartnerGroupInput
}

export async function setDefaultPartnerGroup({ ctx, input }: SetDefaultPartnerGroup) {
    const { orgId } = await assertOrgMember({ ctx })
    const program = await partnerGroupService.setDefaultPartnerGroup({ orgId, ...input })
    return { ...program }
}