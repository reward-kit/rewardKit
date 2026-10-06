import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { NextResponse } from "next/server"
import { AuthContext, authedRoute } from '@rewardkit/packages/server/routes/authed.route';
import { ZProgramResource } from "@rewardkit/packages/types/program/program.schema";
import { withRequestId } from "@rewardkit/packages/server/with-request-id";

export const POST = withRequestId(authedRoute
    .metadata({ requiredPermissions: ["program:write"] })
    .body(ZProgramResource)
    .handler(async (request, context) => {
        const { userId } = context.ctx as AuthContext
        const program = await programService.createProgram({ userId, programData: context.body })
        return NextResponse.json(program, { status: 201 })
    })
)
export const GET = withRequestId(authedRoute
    .metadata({ requiredPermissions: ['program:read'] })
    .handler(async (request, context) => {
        const { orgId } = context.ctx as AuthContext
        const program = await programService.getProgramByOrgId({ orgId })
        return NextResponse.json(program, { status: 200 })
    }))