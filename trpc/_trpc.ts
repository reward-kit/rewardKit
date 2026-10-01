import { initTRPC, TRPCError } from "@trpc/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@rewardkit/packages/db/db"
import { connectDB } from "@rewardkit/packages/db/connectDB"
import { NextRequest } from "next/server"
import { clerk } from "@rewardkit/packages/infra/clerk/clerk.config"

type CreateContextProps = {
    userId?: string | null,
    orgId?: string | null,
    orgRole?: string | null,
}

export type ContextProps = CreateContextProps & {
    db: typeof db
}

export type InternalTRPCContext = {
    db: typeof db
}

/**
 * This helper generates the "internals" for a tRPC context
 */
const createInnerTRPCContext = (opts: CreateContextProps) => {
    return {
        ...opts,
        db
    }
}

type CreateContextProp = {
    req: NextRequest
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async (opts: CreateContextProp) => {
    const { userId, orgId, orgRole } = await auth()

    await connectDB()

    return createInnerTRPCContext({
        userId: userId ?? null,
        orgId: orgId ?? null,
        orgRole: orgRole ?? null,
    })
}

export type Context = Awaited<ReturnType<typeof createContext>>

export const createInternalTRPCContext = async (): Promise<InternalTRPCContext> => {
    await connectDB();
    return {
        db,
    }
}

const t = initTRPC
    .context<ContextProps>()
    .create()

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return opts.next({
        ctx: {
            ...ctx,
            userId: ctx.userId
        }
    })
})

const enforceUserHasOrg = t.middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.orgId) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "No active organization selected"
        });
    }
    return opts.next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
            orgId: ctx.orgId,
            orgRole: ctx.orgRole
        }
    });
});

// Checks user is in an org AND is an admin
const enforceOrgAdmin = t.middleware(async (opts) => {
    const { ctx } = opts;

    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.orgId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No active organization" });
    }
    if (ctx.orgRole !== "org:admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return opts.next({
        ctx: { ...ctx, userId: ctx.userId, orgId: ctx.orgId, orgRole: ctx.orgRole }
    });
});

const enforceConsoleAccess = t.middleware(async (opts) => {
    const { ctx } = opts;

    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
        const user = await clerk.users.getUser(ctx.userId);
        const isAdmin = user.publicMetadata?.isAdmin === true;

        if (!isAdmin) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Console access required"
            });
        }
    } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unable to verify console access"
        });
    }

    return opts.next({
        ctx: { ...ctx, userId: ctx.userId }
    });
});

/**
 * This is how you create new routers and sub routers in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const orgProcedure = t.procedure.use(enforceUserHasOrg);
export const adminProcedure = t.procedure.use(enforceOrgAdmin);
export const consoleProcedure = t.procedure.use(enforceConsoleAccess);