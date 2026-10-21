import z from "zod"

export const ZVisitorStatsByPartner = z.object({
    total_visitors: z.number().int().min(0),
})

export type VisitorStatsByPartner = z.infer<typeof ZVisitorStatsByPartner>
