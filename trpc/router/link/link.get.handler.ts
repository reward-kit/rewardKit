import { linkService } from "@rewardkit/packages/features/link/services/link.service"
import { GetLinkInput } from "@rewardkit/packages/types/link/link.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type GetLink = {
    ctx: ContextProps
    input: GetLinkInput
}

export async function getLink({ ctx, input }: GetLink) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await linkService.get({ orgId, partnerId: input.partnerId, linkId: input.linkId })
    return { ...result }
}
