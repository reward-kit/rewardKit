import { createTRPCReact } from "@trpc/react-query" 
import type { AppRouter } from "../_root" 
export const trpc:  ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>()
