import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createZodRoute, } from "next-zod-route"
import { connectDB } from "@rewardkit/packages/db/connectDB"
import { API_KEY_PREFIX, apiKeyService } from "@rewardkit/packages/features/apiKey/services/api-key.service"
import { permissionCheckMiddleware } from "../middlewares/permission.middleware"
import { permissionsMetadataSchema } from "../types/permission.middleware.type"
import { AppError } from "@rewardkit/packages/errors/app-error"

const unauthorized = (long_message: string) =>
    NextResponse.json({ error: "Unauthorized", long_message }, { status: 401 })

export type AuthContext = {
    userId: string
    orgId: string
    authType: "session" | "apiKey"
    permissions: string[]
}

async function resolveIdentity(request: Request): Promise<AuthContext | Response> {
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")

    // External callers: API key authentication
    await connectDB()
    if (bearer?.startsWith(API_KEY_PREFIX)) {
        const key = await apiKeyService.verifyApiKey(bearer)
        if (!key || !key.userId || !key.orgId) {
            return unauthorized("Invalid, expired or revoked API key")
        }

        // Retrieve scopes tied to this API Key
        const permRes = await apiKeyService.getPermissions({ apiKey: bearer })
        const permissions = permRes.permissions ?? []

        return {
            userId: key.userId,
            orgId: key.orgId,
            authType: "apiKey",
            permissions
        }
    }

    const { userId, orgId } = await auth()

    if (!userId) return unauthorized("You must be logged in to perform this action")
    if (!orgId) return NextResponse.json(
        { error: "No active organization", long_message: "You must be part of an organization to perform this action" },
        { status: 403 }
    )

    return { userId, orgId, authType: "session", permissions: ["*"] }
}

export const authedRoute = createZodRoute({
    handleServerError: (error) => {
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.code ?? error.name, message: error.message },
                { status: error.statusCode }
            )
        }

        // Unknown errors: log the real error, don't leak details to the client
        console.error("[API ERROR]", error)
        return NextResponse.json(
            { error: "INTERNAL_SERVER_ERROR", message: "Internal server error" },
            { status: 500 }
        )
    },
})
    .defineMetadata(permissionsMetadataSchema)
    .use(async ({ request, next }) => {
        const identity = await resolveIdentity(request)
        if (identity instanceof Response) return identity
        return next({ ctx: identity })
    })
    .use(permissionCheckMiddleware)