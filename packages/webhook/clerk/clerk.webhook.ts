import { type IWebhookVerifier } from "@rewardkit/packages/webhook/webhook-verifier"
import { CLERK_EVENT_MAP, type ClerkEventType } from "@rewardkit/packages/webhook/clerk/types"
import type { GenericWebhookEvent } from "@rewardkit/packages/webhook/types"
import { env } from "@rewardkit/packages/env"
import { verifyWebhook } from "@clerk/backend/webhooks"

export class ClerkWebhookVerifier implements IWebhookVerifier {
  async verify(req: Request): Promise<GenericWebhookEvent> {

    const svixId = req.headers.get("svix-id")
    const svixTimestamp = req.headers.get("svix-timestamp")
    const svixSignature = req.headers.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new Error("Missing svix headers")
    }

    const event = await verifyWebhook(req, { signingSecret: env.clerk.webhookSecretKey })

    const mapping = CLERK_EVENT_MAP[event.type as ClerkEventType]
    if (!mapping) {
      throw new Error(`Unhandled Clerk event: ${event.type}`)
    }

    return {
      provider: "clerk",
      eventType: event.type,
      resource: mapping.resource,
      operation: mapping.operation,
      payload: event.data,
      raw: event,
    }
  }
}