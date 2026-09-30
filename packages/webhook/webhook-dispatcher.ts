import { type GenericWebhookEvent, type WebhookOperation } from "@rewardkit/packages/webhook/types";

export type OperationHandler = (
    event: GenericWebhookEvent
) => Promise<void>;

export type IWebhookHandler = Partial<
    Record<WebhookOperation, OperationHandler>
>;
export class WebhookDispatcher {
    constructor(
        private readonly handlers: Record<string, IWebhookHandler>
    ) { }

    async dispatch(event: GenericWebhookEvent): Promise<void> {
        const handler = this.handlers[event.resource];
        if (!handler) return;

        const operationHandler = handler[event.operation];
        if (!operationHandler) return;

        await operationHandler.call(handler, event);
    }
}
