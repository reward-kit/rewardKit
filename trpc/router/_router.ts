import { createTRPCRouter } from "../_trpc";
import { programRouter } from "./program/_router";

export const router = createTRPCRouter({
    program: programRouter
})
