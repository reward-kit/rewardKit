import { linkService } from "@rewardkit/packages/features/link/services/link.service"
import { ListLinksInput } from "@rewardkit/packages/types/link/link.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type ListLinks = {
    ctx: ContextProps
    input: ListLinksInput
}

export async function listLinks({ ctx, input }: ListLinks) {
    const { orgId } = await assertOrgMember({ ctx })
    const result = await linkService.list({ orgId, ...input })
    return { ...result }
}
