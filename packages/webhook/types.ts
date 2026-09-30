export type WebhookOperation =
  | "create"
  | "update"
  | "cancel"
  | "uncancel"
  | "renewed"
  | "pastDue"
  | "resume"
  | "expire" 
  | "pause" 
  | "unpause"
  | "active"
  | "cycled"

export interface GenericWebhookEvent<TPayload = unknown> {
  provider: string;
  eventType: string;
  resource: string;
  operation: WebhookOperation;
  payload: TPayload;
  raw: unknown;
}