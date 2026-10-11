import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { DeletePartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type DeletePartner = {
    ctx: ContextProps
    input: DeletePartnerInput
}

export async function deletePartner({ ctx, input }: DeletePartner) {
    const { orgId } = await assertOrgMember({ ctx })
    await partnerService.delete({ orgId, ...input })
    return { success: true, message: "Partner deleted successfully" }
}
