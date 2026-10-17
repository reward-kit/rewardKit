import { linkService } from "@rewardkit/packages/features/link/services/link.service"
import { CreateLinkInput } from "@rewardkit/packages/types/link/link.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type CreateLink = {
    ctx: ContextProps
    input: CreateLinkInput
}

export async function createLink({ ctx, input }: CreateLink) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await linkService.create({ orgId, partnerId: input.partnerId, linkData: input.linkData })
    return { ...result }
}
