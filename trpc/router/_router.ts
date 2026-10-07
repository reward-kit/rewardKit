import { createTRPCRouter } from "../_trpc";
import { partnerGroupsRouter } from "./partner-groups/_router";
import { programRouter } from "./program/_router";

export const router = createTRPCRouter({
    program: programRouter,
    partnerGroups: partnerGroupsRouter
})
