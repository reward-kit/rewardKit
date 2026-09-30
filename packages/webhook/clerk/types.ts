
export const CLERK_EVENT_MAP = {
  "user.created": { resource: "user", operation: "create" },
  "organization.created": { resource: "organization", operation: "create" },
} as const;

export type ClerkEventType = keyof typeof CLERK_EVENT_MAP;
