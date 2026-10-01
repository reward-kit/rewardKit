import z from "zod";

export const API_KEY_STATUS = {
    ACTIVE: "active",
    REVOKED: "revoked",
} as const;

export const API_KEY_SCOPE = {
    PROGRAM_READ: "program:read",
    PROGRAM_WRITE: "program:write"
}

export const ZApiKey = z.object({
    _id: z.string().optional(),
    orgId: z.string().optional(),
    userId: z.string().optional(),
    name: z.string(),
    key: z.string().optional(),
    scopes: z.array(z.enum(API_KEY_SCOPE)).optional(),
    status: z.enum(API_KEY_STATUS).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    lastUsedAt: z.string().optional(),
    expiresAt: z.string().optional(),
    revokedAt: z.string().optional(),
});

export type ApiKeyResource = z.infer<typeof ZApiKey>;