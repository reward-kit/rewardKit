import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service"
import { CreatePartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type CreatePartner = {
    ctx: ContextProps
    input: CreatePartnerInput
}

export async function createPartner({ ctx, input }: CreatePartner) {
    const { orgId } = await assertOrgMember({ ctx })
    const partner = await partnerService.create({ orgId, ...input })
    return { success: true, message: "Partner created successfully", partner }
}
