import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createZodRoute } from "next-zod-route"
import { connectDB } from "@rewardkit/packages/db/connectDB"

const unauthorized = (long_message: string) => NextResponse.json({ error: "Unauthorized", long_message }, { status: 401 })

export type AuthContext = { userId: string; orgId: string; authType: "session" | "apiKey" }

async function resolveIdentity(): Promise<AuthContext | Response> {
    // frontend: existing Clerk session logic, unchanged
    const { userId, orgId } = await auth()

    if (!userId) return unauthorized("You must be logged in to perform this action")
    if (!orgId) return NextResponse.json(
        { error: "No active organization", long_message: "You must be part of an organization to perform this action" },
        { status: 403 }
    )
    return { userId, orgId, authType: "session" }
}

export const keyRoute = createZodRoute()
    .use(async ({ request, next }) => {
        const identity = await resolveIdentity()
        if (identity instanceof Response) return identity
        connectDB()
        return next({ ctx: identity })
    })