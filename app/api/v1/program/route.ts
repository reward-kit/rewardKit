import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { NextResponse } from "next/server"
import { AuthContext, authedRoute } from '@rewardkit/packages/server/routes/authed.route';
import { ZProgramResource } from "@rewardkit/packages/types/program/program.schema";

export const POST = authedRoute
    .metadata({ requiredPermissions: ["program:write"] })
    .body(ZProgramResource)
    .handler(async (request, context) => {
        const { orgId, userId } = context.ctx as AuthContext
        const program = await programService.createProgram({ orgId, userId, programData: context.body })
        return NextResponse.json(program, { status: 201 })
    })