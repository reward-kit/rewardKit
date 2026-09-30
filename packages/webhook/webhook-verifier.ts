import type { GenericWebhookEvent } from "@rewardkit/packages/webhook/types";

export interface IWebhookVerifier<TReq = unknown> {
  verify(req: TReq): Promise<GenericWebhookEvent>;
}