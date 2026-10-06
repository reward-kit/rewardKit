import { TRPCError } from "@trpc/server"
import { clerk } from "@rewardkit/packages/infra/clerk/clerk.config"
import { ContextProps } from "../_trpc"

/**
 * Asserts that the given userId belongs to the given orgId.
 * Throws an HTTPException if not authenticated or not a member.
 */
export async function assertUser({
    ctx
}: {
    ctx: ContextProps
}): Promise<{ userId: string }> {
    const { userId } = ctx
    if (!userId) {
        throw new TRPCError({ message: "UserId is not found", code: "FORBIDDEN" })
    }

    try {
        const user = await clerk.users.getUser(userId)
        if (!user) {
            throw new TRPCError({ message: "Authentication required", code: "FORBIDDEN" })
        }
    } catch {
        throw new TRPCError({ message: "Error while fetching user record from vendor", code: "FORBIDDEN" })
    }

    return { userId }
}