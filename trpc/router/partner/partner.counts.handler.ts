import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { PartnerCountsInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type PartnerCounts = {
    ctx: ContextProps
    input: PartnerCountsInput
}

export async function partnerCounts({ ctx, input }: PartnerCounts) {
    const { orgId } = await assertOrgMember({ ctx })
    const counts = await partnerService.counts({ orgId, ...input })
    return { success: true, message: "Partner counts retrieved successfully", counts }
}
