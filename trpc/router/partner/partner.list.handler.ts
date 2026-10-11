import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { ListPartnersInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type ListPartners = {
    ctx: ContextProps
    input: ListPartnersInput
}

export async function listPartners({ ctx, input }: ListPartners) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await partnerService.list({ orgId, ...input })
    return { success: true, message: "Partners retrieved successfully", ...result }
}
