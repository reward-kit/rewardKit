import { ZUpdateProgramRequest } from "@rewardkit/packages/types/program/program.api.schema";
import { createTRPCRouter, orgProcedure } from "../../_trpc";
import { type GetCurrentProgram, getCurrentProgram } from "./program.current.handler";
import { type UpdateProgram, updateProgram } from "./program.update.handler";
import { ProgramList, programList } from "./program.list.handler";

export const programRouter = createTRPCRouter({
    getCurrentProgram: orgProcedure.query(async (opts: GetCurrentProgram) => getCurrentProgram(opts)),
    updateProgram: orgProcedure.input(ZUpdateProgramRequest).mutation(async (opts: UpdateProgram) => updateProgram(opts)),
    listPrograms: orgProcedure.query(async (opts: ProgramList) => programList(opts))
})