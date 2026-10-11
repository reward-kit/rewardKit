import { NextResponse } from "next/server"
import { AuthContext, authedRoute } from '@rewardkit/packages/server/routes/authed.route';
import { withRequestId } from "@rewardkit/packages/server/with-request-id";
import { partnerService } from "@rewardkit/packages/features/partner/services/partner.service";
import { ZPartner } from "@rewardkit/packages/types/partner/partner.schema";

export const POST = withRequestId(authedRoute
    .metadata({ requiredPermissions: ["program:write"] })
    .body(ZPartner)
    .handler(async (request, context) => {
        const { orgId } = context.ctx as AuthContext
        const program = await partnerService.create({ orgId, partnerData: context.body })
        return NextResponse.json(program, { status: 201 })
    })
)
// export const GET = withRequestId(authedRoute
//     .metadata({ requiredPermissions: ['program:read'] })
//     .handler(async (request, context) => {
//         const { orgId } = context.ctx as AuthContext
//         const program = await partnerService.list({ orgId })
//         return NextResponse.json(program, { status: 200 })
//     }))