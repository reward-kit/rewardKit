import { appRouter } from "@rewardkit/trpc/_root";
import { createContext } from "@rewardkit/trpc/_trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const handler = (req: NextRequest) => {
    return fetchRequestHandler({
        endpoint: "/api/v1/trpc",
        req,
        router: appRouter,
        createContext: () => createContext({ req })
    })
}

export { handler as GET, handler as POST }