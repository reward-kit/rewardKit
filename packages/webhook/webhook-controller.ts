import { WebhookDispatcher } from "@rewardkit/packages/webhook/webhook-dispatcher";
import { type IWebhookVerifier } from "@rewardkit/packages/webhook/webhook-verifier";

export class WebhookController {
    constructor(
        private readonly verifier: IWebhookVerifier,
        private readonly dispatcher: WebhookDispatcher
    ) { }

    async webhook(req: Request): Promise<Response> {
        try {
            const event = await this.verifier.verify(req);
            await this.dispatcher.dispatch(event);
            return Response.json({ ok: true }, { status: 200 });
        } catch (err) {
            console.warn("[Webhook]: ", err instanceof Error ? err.message : "Something went wrong")
            console.error("[Webhook]: ", err instanceof Error ? err : "Something went wrong")
            return Response.json(
                { ok: false, error: err instanceof Error ? err.message : "Unknown" },
                { status: 400 }
            );
        }
    }
}