import { createTRPCRouter } from "../_trpc";
import { linkRouter } from "./link/_router";
import { partnerGroupsRouter } from "./partner-groups/_router";
import { partnerRouter } from "./partner/_router";
import { programRouter } from "./program/_router";

export const router = createTRPCRouter({
    program: programRouter,
    partnerGroups: partnerGroupsRouter,
    partner: partnerRouter,
    link: linkRouter
})
