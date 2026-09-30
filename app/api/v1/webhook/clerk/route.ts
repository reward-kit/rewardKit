import { OrganizationHandler } from "@rewardkit/packages/features/organization/handler/organization.handler"
import { UserHandler } from "@rewardkit/packages/features/user/handler/user.handler"
import { ClerkWebhookVerifier } from "@rewardkit/packages/webhook/clerk/clerk.webhook"
import { WebhookController } from "@rewardkit/packages/webhook/webhook-controller"
import { WebhookDispatcher } from "@rewardkit/packages/webhook/webhook-dispatcher"

export const runtime = "nodejs"

const dispatcher = new WebhookDispatcher({
    user: new UserHandler(),
    organization: new OrganizationHandler(),
})

const clerkController = new WebhookController(new ClerkWebhookVerifier(), dispatcher)

export const POST = async (req: Request) => {
    return clerkController.webhook(req)
}