import { linkService } from "@rewardkit/packages/features/link/services/link.service"
import { DeleteLinkInput } from "@rewardkit/packages/types/link/link.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type DeleteLink = {
    ctx: ContextProps
    input: DeleteLinkInput
}

export async function deleteLink({ ctx, input }: DeleteLink) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await linkService.delete({ orgId, partnerId: input.partnerId, linkId: input.linkId })
    return { ...result }
}
