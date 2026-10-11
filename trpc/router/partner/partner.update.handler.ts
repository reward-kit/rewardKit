import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { UpdatePartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type UpdatePartner = {
    ctx: ContextProps
    input: UpdatePartnerInput
}

export async function updatePartner({ ctx, input }: UpdatePartner) {
    const { orgId } = await assertOrgMember({ ctx })
    const partner = await partnerService.update({ orgId, ...input })
    return { success: true, message: "Partner updated successfully", partner }
}
