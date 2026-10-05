import z from "zod"

export const ZBaseAPIResponse = z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
})
export type BaseAPIResponse = z.infer<typeof ZBaseAPIResponse>