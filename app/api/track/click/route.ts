import { NextResponse } from "next/server";
import { createZodRoute } from "next-zod-route";
import { connectDB } from "@rewardkit/packages/db/connectDB";
import { AppError } from "@rewardkit/packages/errors/app-error";
import { withRequestId } from "@rewardkit/packages/server/with-request-id";
import { ZTrackClickRequest } from "@rewardkit/packages/types/click/click.api.schema";
import { trackingService } from "@rewardkit/packages/features/tracking/services/tracking.service";

// Public, unauthenticated endpoint hit by tracking.js on partner sites.
// It deliberately lives outside authedRoute: no session, no API key.
const route = createZodRoute({
    handleServerError: (error) => {
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.code ?? error.name, message: error.message },
                { status: error.statusCode },
            )
        }

        console.error("[API ERROR]", error)
        return NextResponse.json(
            { error: "INTERNAL_SERVER_ERROR", message: "Internal server error" },
            { status: 500 },
        )
    },
})

function withCors(response: NextResponse): NextResponse {
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")
    response.headers.set("Access-Control-Max-Age", "86400")
    return response
}

const handler = route.body(ZTrackClickRequest).handler(async (request, context) => {
    await connectDB()
    const { response } = await trackingService.trackClick(request, context.body)
    return NextResponse.json(response, { status: 200 })
})

export const POST = withRequestId(async (request: Request, ctx: any) => {
    const res = await handler(request, ctx)
    const out = res instanceof NextResponse ? res : new NextResponse(res.body, res)
    return withCors(out) // success, tracked:false, validation and server errors all get it
})

export const OPTIONS = () => withCors(new NextResponse(null, { status: 204 }))
