import { NextResponse } from "next/server"
import z from "zod"
import { apiKeyService } from "@rewardkit/packages/features/apiKey/services/api-key.service"
import { ZUpdateApiKey } from "@rewardkit/packages/types/apiKey/api-key.api.schema"
import { AuthContext, keyRoute } from "@rewardkit/packages/server/routes/key.route"

export const PATCH = keyRoute
    .params(z.object({ keyId: z.string() }))
    .body(ZUpdateApiKey)
    .handler(async (_request, context) => {
        const { orgId, authType } = context.ctx as AuthContext

        // key management is dashboard-only, so a leaked key can't edit keys
        if (authType !== "session") {
            return NextResponse.json({ error: "Forbidden", long_message: "This action requires a signed-in session" }, { status: 403 })
        }

        const result = await apiKeyService.updateApiKey({ id: context.params.keyId, orgId, data: context.body })
        if (!result) return NextResponse.json({ error: "API key not found" }, { status: 404 })
        return NextResponse.json(result)
    })

export const DELETE = keyRoute
    .params(z.object({ keyId: z.string() }))
    .handler(async (_request, context) => {
        const { orgId, authType } = context.ctx as AuthContext

        // key management is dashboard-only, so a leaked key can't delete keys
        if (authType !== "session") {
            return NextResponse.json({ error: "Forbidden", long_message: "This action requires a signed-in session" }, { status: 403 })
        }

        const result = await apiKeyService.revokeApiKey({ id: context.params.keyId, orgId })
        if (!result) return NextResponse.json({ error: "API key not found" }, { status: 404 })
        return NextResponse.json({ success: true })
    })