import { router } from "./router/_router"
import { mergeRouters } from "./_trpc"
import type { inferRouterOutputs } from "@trpc/server"

export const appRouter = mergeRouters(router)
export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterOutputs<AppRouter>
