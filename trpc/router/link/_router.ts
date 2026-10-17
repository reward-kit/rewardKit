import { ZCreateLinkInput, ZDeleteLinkInput, ZGetLinkInput, ZListLinksInput, ZUpdateLinkInput } from "@rewardkit/packages/types/link/link.api.schema";
import { createTRPCRouter, orgProcedure } from "../../_trpc";
import { createLink, CreateLink } from "./link.create.handler";
import { deleteLink, DeleteLink } from "./link.delete.handler";
import { getLink, GetLink } from "./link.get.handler";
import { listLinks, ListLinks } from "./link.list.handler";
import { updateLink, UpdateLink } from "./link.update.handler";

export const linkRouter = createTRPCRouter({
    createLink: orgProcedure.input(ZCreateLinkInput).mutation(async (opts: CreateLink) => createLink(opts)),
    getLink: orgProcedure.input(ZGetLinkInput).query(async (opts: GetLink) => getLink(opts)),
    listLinks: orgProcedure.input(ZListLinksInput).query(async (opts: ListLinks) => listLinks(opts)),
    updateLink: orgProcedure.input(ZUpdateLinkInput).mutation(async (opts: UpdateLink) => updateLink(opts)),
    deleteLink: orgProcedure.input(ZDeleteLinkInput).mutation(async (opts: DeleteLink) => deleteLink(opts)),
})
