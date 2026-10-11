import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { GetPartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type GetPartner = {
    ctx: ContextProps
    input: GetPartnerInput
}

export async function getPartner({ ctx, input }: GetPartner) {
    const { orgId } = await assertOrgMember({ ctx })
    const partner = await partnerService.get({ orgId, ...input })
    return { success: true, message: "Partner retrieved successfully", partner }
}
