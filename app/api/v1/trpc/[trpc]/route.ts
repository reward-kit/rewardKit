import { appRouter } from "@rewardkit/trpc/_root";
import { createContext } from "@rewardkit/trpc/_trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const handler = (req: NextRequest) => {
    return fetchRequestHandler({
        endpoint: "/api/v1/trpc",
        req,
        router: appRouter,
        createContext: () => createContext({ req }),
        onError({ error, path, type, ctx }) {
            const log = {
                requestId: ctx?.requestId,
                path,
                type,
                userId: ctx?.userId,
                orgId: ctx?.orgId,
                code: error.code,
            }

            // 4xx are expected (not found, forbidden): log briefly, no stack
            if (error.code !== "INTERNAL_SERVER_ERROR") {
                console.warn("[TRPC]", log, error.message)
                return
            }
            console.error("[TRPC ERROR]", log, error)
        },

        responseMeta({ ctx }) {
            return ctx?.requestId
                ? { headers: { "x-request-id": ctx.requestId } }
                : {}
        },
    })
}

export { handler as GET, handler as POST }
