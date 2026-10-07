import { ZCreatePartnerGroupInput, ZDeletePartnerGroupInput, ZSetDefaultPartnerGroupInput, ZUpdatePartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema";
import { createTRPCRouter, orgProcedure } from "../../_trpc";
import { createPartnerGroup, CreatePartnerGroup } from "./partner-groups.create.handler";
import { listPartnerGroup, ListPartnerGroup } from "./partner-groups.list.handler";
import { deletePartnerGroup, DeletePartnerGroup } from "./partner-groups.delete.handler";
import { setDefaultPartnerGroup, SetDefaultPartnerGroup } from "./partner-groups.marks-default.handler";
import { updatePartnerGroup, UpdatePartnerGroup } from "./partner-groups.update.handler";

export const partnerGroupsRouter = createTRPCRouter({
    createPartnerGroup: orgProcedure.input(ZCreatePartnerGroupInput).mutation(async (opts: CreatePartnerGroup) => createPartnerGroup(opts)),
    listPartnerGroups: orgProcedure.query(async (opts: ListPartnerGroup) => listPartnerGroup(opts)),
    setDefaultPartnerGroup: orgProcedure.input(ZSetDefaultPartnerGroupInput).mutation(async (opts: SetDefaultPartnerGroup) => setDefaultPartnerGroup(opts)),
    updatePartnerGroup: orgProcedure.input(ZUpdatePartnerGroupInput).mutation(async (opts: UpdatePartnerGroup) => updatePartnerGroup(opts)),
    deletePartnerGroup: orgProcedure.input(ZDeletePartnerGroupInput).mutation(async (opts: DeletePartnerGroup) => deletePartnerGroup(opts)),
})