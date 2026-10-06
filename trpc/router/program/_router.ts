import { ZCheckSubdomainRequest, ZCreateProgramInput, ZDeleteProgramInput, ZUpdateProgramRequest } from "@rewardkit/packages/types/program/program.api.schema";
import { createTRPCRouter, orgProcedure, protectedProcedure } from "../../_trpc";
import { type GetCurrentProgram, getCurrentProgram } from "./program.current.handler";
import { type UpdateProgram, updateProgram } from "./program.update.handler";
import { ProgramList, programList } from "./program.list.handler";
import { createProgram, CreateProgram } from "./program.create.handler";
import { checkSubdomain, CheckSubdomain } from "./program.check-subdomain.handler";
import { deleteProgram, DeleteProgram } from "./program.delete.handler";

export const programRouter = createTRPCRouter({
    createProgram: protectedProcedure.input(ZCreateProgramInput).mutation(async (opts: CreateProgram) => createProgram(opts)),
    getCurrentProgram: protectedProcedure.query(async (opts: GetCurrentProgram) => getCurrentProgram(opts)),
    updateProgram: orgProcedure.input(ZUpdateProgramRequest).mutation(async (opts: UpdateProgram) => updateProgram(opts)),
    listPrograms: protectedProcedure.query(async (opts: ProgramList) => programList(opts)),
    checkSubdomain: protectedProcedure.input(ZCheckSubdomainRequest).query(async (opts: CheckSubdomain) => checkSubdomain(opts)),
    deleteProgram: protectedProcedure.input(ZDeleteProgramInput).mutation(async (opts: DeleteProgram) => deleteProgram(opts)),
})