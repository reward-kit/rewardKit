import z from "zod";

export const ZUser = z.object({
    _id: z.string().optional(),
    userId: z.string().optional(),
    email: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    profileUrl: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
})

export type UserResource = z.infer<typeof ZUser>