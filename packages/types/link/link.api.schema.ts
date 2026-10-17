import z from "zod"
import { ZBaseAPIResponse } from "../api/base.api.schema"
import { ZPaginatedResponse } from "../paginated-response"
import { URL_PARAMETER } from "../program/program.schema"
import { LINK_STATUS, ZLinkSchema } from "./link.schema"

// fields the server owns and the client should never send
const ZLinkServerFields = {
    _id: true,
    id: true,
    orgId: true,
    programId: true,
    createdAt: true,
    updatedAt: true,
} as const

// orgId comes from the session on the server, never from the client

// Same rule the DB enforces, shared by create + update.
export const ZLinkCode = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Use at least 3 characters")
    .max(32, "Use 32 characters or fewer")
    .regex(/^[a-z0-9][a-z0-9_-]*$/, "Use lowercase letters, numbers, - and _")

// What the client sends when creating/updating the code itself.
// `code` is optional on create: the server derives one from the partner's name.
export const ZLinkData = z.object({
    code: ZLinkCode.optional(),
    // chosen from the parameters the program allows (program.urlParams)
    urlParam: z.enum(URL_PARAMETER).optional(),
    status: z.enum(LINK_STATUS).optional(),
})
export type LinkData = z.infer<typeof ZLinkData>

// ---------- Per-link performance ----------
// Dummy numbers for now (derived from the link id so they stay stable).
// Swap for real tracking data once the clicks/leads/customers collections exist.
export const ZLinkStats = z.object({
    clicks: z.number().int().min(0),
    leads: z.number().int().min(0),
    customers: z.number().int().min(0),
    revenue: z.number().int().min(0),    // minor units (cents)
    commission: z.number().int().min(0), // minor units (cents)
})
export type LinkStats = z.infer<typeof ZLinkStats>

// A row in the partner links table: the stored link + its own metrics + resolved url.
export const ZLinkListItem = ZLinkSchema.extend({
    url: z.string().optional(),
    stats: ZLinkStats,
})
export type LinkListItem = z.infer<typeof ZLinkListItem>

// ---------- Create ----------
export const ZCreateLinkRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    linkData: ZLinkData.optional(),
})
export type CreateLinkRequest = z.infer<typeof ZCreateLinkRequest>

export const ZCreateLinkInput = ZCreateLinkRequest.omit({ orgId: true })
export type CreateLinkInput = z.infer<typeof ZCreateLinkInput>

export const ZCreateLinkResponse = ZBaseAPIResponse.extend({
    link: ZLinkListItem,
})
export type CreateLinkResponse = z.infer<typeof ZCreateLinkResponse>

// ---------- Get ----------
export const ZGetLinkRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    linkId: z.string(),
})
export type GetLinkRequest = z.infer<typeof ZGetLinkRequest>

export const ZGetLinkInput = ZGetLinkRequest.omit({ orgId: true })
export type GetLinkInput = z.infer<typeof ZGetLinkInput>

export const ZGetLinkResponse = ZBaseAPIResponse.extend({
    link: ZLinkListItem,
})
export type GetLinkResponse = z.infer<typeof ZGetLinkResponse>

// ---------- List (links of one partner, paginated) ----------
export const ZListLinksRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    status: z.enum(LINK_STATUS).optional(),
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    // only stored fields can be sorted in the DB; metrics sort client-side
    sortBy: z.string().optional(),
    desc: z.boolean().optional(),
})
export type ListLinksRequest = z.infer<typeof ZListLinksRequest>

export const ZListLinksInput = ZListLinksRequest.omit({ orgId: true })
export type ListLinksInput = z.infer<typeof ZListLinksInput>

export const ZListLinksResponse = ZBaseAPIResponse
    .extend(ZPaginatedResponse(ZLinkListItem).shape)
export type ListLinksResponse = z.infer<typeof ZListLinksResponse>

// ---------- Update (code / status) ----------
export const ZUpdateLinkRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    linkId: z.string(),
    linkData: ZLinkData,
})
export type UpdateLinkRequest = z.infer<typeof ZUpdateLinkRequest>

export const ZUpdateLinkInput = ZUpdateLinkRequest.omit({ orgId: true })
export type UpdateLinkInput = z.infer<typeof ZUpdateLinkInput>

export const ZUpdateLinkResponse = ZBaseAPIResponse.extend({
    link: ZLinkListItem,
})
export type UpdateLinkResponse = z.infer<typeof ZUpdateLinkResponse>

// ---------- Delete ----------
export const ZDeleteLinkRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    linkId: z.string(),
})
export type DeleteLinkRequest = z.infer<typeof ZDeleteLinkRequest>

export const ZDeleteLinkInput = ZDeleteLinkRequest.omit({ orgId: true })
export type DeleteLinkInput = z.infer<typeof ZDeleteLinkInput>

export const ZDeleteLinkResponse = ZBaseAPIResponse
export type DeleteLinkResponse = z.infer<typeof ZDeleteLinkResponse>
