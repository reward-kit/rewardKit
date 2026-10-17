import { linkService } from "@rewardkit/packages/features/link/services/link.service"
import { UpdateLinkInput } from "@rewardkit/packages/types/link/link.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type UpdateLink = {
    ctx: ContextProps
    input: UpdateLinkInput
}

export async function updateLink({ ctx, input }: UpdateLink) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await linkService.update({
        orgId,
        partnerId: input.partnerId,
        linkId: input.linkId,
        linkData: input.linkData,
    })
    return { ...result }
}
