import z from "zod"

export const ZClickStatsByPartner = z.object({
    total_clicks: z.number().int().min(0),
})

export type ClickStatsByPartner = z.infer<typeof ZClickStatsByPartner>

// Public tracking API — everything a browser can send us. Kept strict so junk
// never reaches Mongo: ids must be ours, codes must match the link regex.
export const ZTrackClickRequest = z.object({
    program_id: z.string().regex(/^prg_[a-z0-9]+$/, "Invalid program id"),
    code: z.string().trim().toLowerCase().min(3).max(32).regex(/^[a-z0-9][a-z0-9_-]*$/, "Invalid link code"),
    page: z.string().trim().max(2048).optional(),
    referrer: z.string().trim().max(2048).optional(),
    param: z.string().trim().max(32).optional(),
    visitor_id: z.string().regex(/^vst_[A-Za-z0-9_-]+$/, "Invalid visitor id").optional(),
})

export type TrackClickRequest = z.infer<typeof ZTrackClickRequest>

export const ZTrackClickResponse = z.object({
    tracked: z.boolean(),
    visitor_id: z.string().optional(),
    click_id: z.string().optional(),
    cookie_duration: z.number().int().min(1).max(365).optional(),
})

export type TrackClickResponse = z.infer<typeof ZTrackClickResponse>
