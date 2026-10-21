import z from "zod";

export const ZClickSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    programId: z.string(),
    partnerId: z.string(),
    linkId: z.string().optional().nullable(),
    visitorId: z.string(),
    code: z.string().trim().toLowerCase().nullable().optional(),
    page: z.string().trim().nullable().optional(),
    param: z.string().trim().nullable().optional(),
    referrer: z.string().trim().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type ClickResource = z.infer<typeof ZClickSchema>;
