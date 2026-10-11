import { ZChangePartnerStatusInput, ZCreatePartnerInput, ZDeletePartnerInput, ZGetPartnerInput, ZListPartnersInput, ZPartnerCountsInput, ZUpdatePartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema";
import { createTRPCRouter, orgProcedure } from "../../_trpc";
import { changePartnerStatus, ChangePartnerStatus } from "./partner.change-status.handler";
import { partnerCounts, PartnerCounts } from "./partner.counts.handler";
import { createPartner, CreatePartner } from "./partner.create.handler";
import { deletePartner, DeletePartner } from "./partner.delete.handler";
import { getPartner, GetPartner } from "./partner.get.handler";
import { listPartners, ListPartners } from "./partner.list.handler";
import { updatePartner, UpdatePartner } from "./partner.update.handler";

export const partnerRouter = createTRPCRouter({
    createPartner: orgProcedure.input(ZCreatePartnerInput).mutation(async (opts: CreatePartner) => createPartner(opts)),
    getPartner: orgProcedure.input(ZGetPartnerInput).query(async (opts: GetPartner) => getPartner(opts)),
    listPartners: orgProcedure.input(ZListPartnersInput).query(async (opts: ListPartners) => listPartners(opts)),
    partnerCounts: orgProcedure.input(ZPartnerCountsInput).query(async (opts: PartnerCounts) => partnerCounts(opts)),
    updatePartner: orgProcedure.input(ZUpdatePartnerInput).mutation(async (opts: UpdatePartner) => updatePartner(opts)),
    changePartnerStatus: orgProcedure.input(ZChangePartnerStatusInput).mutation(async (opts: ChangePartnerStatus) => changePartnerStatus(opts)),
    deletePartner: orgProcedure.input(ZDeletePartnerInput).mutation(async (opts: DeletePartner) => deletePartner(opts)),
})
