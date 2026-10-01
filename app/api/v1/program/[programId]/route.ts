import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { NextResponse } from "next/server"
import { authedRoute } from '@rewardkit/packages/server/routes/authed.route';

export const GET = authedRoute
    .metadata({ requiredPermissions: ["program:read"] })
    .handler(async (request, context) => {
        const program = await programService.getProgram({ programId: context.params.programId })
        return NextResponse.json(program, { status: 200 })
    })

export const PATCH = authedRoute
    .metadata({ requiredPermissions: ["program:write"] })
    .handler(async (request, context) => {
        const program = await programService.updateProgram({ programId: context.params.programId, programData: context.body })
        return NextResponse.json(program, { status: 200 })
    })