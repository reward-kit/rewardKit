import { TRPCError } from "@trpc/server"
import { clerk } from "@rewardkit/packages/infra/clerk/clerk.config"
import { ContextProps } from "../_trpc"

/**
 * Asserts that the given userId belongs to the given orgId.
 * Throws an HTTPException if not authenticated or not a member.
 */
export async function assertOrgMember({
    ctx
}: {
    ctx: ContextProps
}): Promise<{ userId: string, orgId: string }> {
    const { userId, orgId } = ctx
    if (!userId || !orgId) {
        throw new TRPCError({ message: "Authentication required", code: "FORBIDDEN" })
    }

    let isMember = false
    try {
        const { data: memberships } = await clerk.users.getOrganizationMembershipList({ userId })
        isMember = memberships.some((m) => m.organization.id === orgId)
    } catch {
        throw new TRPCError({ message: "You are not a member of this organization", code: "FORBIDDEN" })
    }

    if (!isMember) {
        throw new TRPCError({ message: "You are not a member of this organization", code: "FORBIDDEN" })
    }

    return { userId, orgId }
}