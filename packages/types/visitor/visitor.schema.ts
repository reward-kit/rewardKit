import z from "zod";

export const VISITOR_STATUS = {
    ACTIVE: "active",
    SUSPENDED: "suspended",
} as const;

export const ZVisitorSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    programId: z.string(),
    partnerId: z.string(),
    name: z.string().trim().nullable().optional(),
    cookieDuration: z.number().int().min(1).max(365).nullable().optional(),
    countryCode: z.string().length(2).regex(/^[A-Z]{2}$/).nullable().optional(),
    deviceManufacturer: z.string().trim().nullable().optional(),
    deviceModel: z.string().trim().nullable().optional(),
    deviceOs: z.string().trim().nullable().optional(),
    deviceOsVersion: z.string().trim().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    firstSeenAt: z.string().nullable().optional(),
    firstSeenPageUrl: z.string().trim().nullable().optional(),
    firstSeenClickId: z.string().nullable().optional(),
    lastSeenAt: z.string().nullable().optional(),
    status: z.enum(VISITOR_STATUS).default(VISITOR_STATUS.ACTIVE),
    isFlagged: z.boolean().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type VisitorResource = z.infer<typeof ZVisitorSchema>;
export type VisitorStatus = (typeof VISITOR_STATUS)[keyof typeof VISITOR_STATUS];
