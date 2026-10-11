import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { ChangePartnerStatusInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type ChangePartnerStatus = {
    ctx: ContextProps
    input: ChangePartnerStatusInput
}

export async function changePartnerStatus({ ctx, input }: ChangePartnerStatus) {
    const { orgId } = await assertOrgMember({ ctx })
    const partner = await partnerService.changeStatus({ orgId, ...input })
    return { success: true, message: "Partner status updated successfully", partner }
}
