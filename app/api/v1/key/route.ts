import { apiKeyService } from "@rewardkit/packages/features/apiKey/services/api-key.service";
import { } from "@rewardkit/packages/server/routes/authed.route";
import { keyRoute, AuthContext } from "@rewardkit/packages/server/routes/key.route";
import { ZApiKey } from "@rewardkit/packages/types/apiKey/api-key.schema";
import { NextResponse } from "next/server";

export const POST = keyRoute
    .body(ZApiKey)
    .handler(async (request, context) => {
        const { orgId, userId } = context.ctx as AuthContext
        const program = await apiKeyService.createApiKey({ orgId, userId, data: context.body })
        return NextResponse.json(program, { status: 201 })
    })