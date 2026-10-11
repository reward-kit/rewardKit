import z from "zod"
import { ZBaseAPIResponse } from "../api/base.api.schema"
import { ZPartner, ZPartnerBase, PARTNER_STATUS } from "./partner.schema"
import { ZPaginatedResponse } from "../paginated-response"

// fields the server owns and the client should never send
const ZPartnerServerFields = {
    id: true,
    orgId: true,
    rejectedAt: true,
    tags: true,
    rejectedReason: true,
    suspendedAt: true,
    suspendedReason: true,
    createdAt: true,
    updatedAt: true,
} as const

// orgId comes from the session on the server, never from the client

// ---------- Create ----------
export const ZCreatePartnerRequest = z.object({
    orgId: z.string(),
    partnerData: ZPartnerBase.omit(ZPartnerServerFields).partial({ groupId: true }),
})
export type CreatePartnerRequest = z.infer<typeof ZCreatePartnerRequest>

export const ZCreatePartnerInput = ZCreatePartnerRequest.omit({ orgId: true })
export type CreatePartnerInput = z.infer<typeof ZCreatePartnerInput>

export const ZCreatePartnerResponse = ZBaseAPIResponse.extend({
    partner: ZPartner,
})
export type CreatePartnerResponse = z.infer<typeof ZCreatePartnerResponse>

// ---------- Get ----------
export const ZGetPartnerRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
})
export type GetPartnerRequest = z.infer<typeof ZGetPartnerRequest>

export const ZGetPartnerInput = ZGetPartnerRequest.omit({ orgId: true })
export type GetPartnerInput = z.infer<typeof ZGetPartnerInput>

export const ZGetPartnerResponse = ZBaseAPIResponse.extend({
    partner: ZPartner,
})
export type GetPartnerResponse = z.infer<typeof ZGetPartnerResponse>

// ---------- Update (profile fields only, not status) ----------
export const ZUpdatePartnerRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    partnerData: ZPartnerBase.omit(ZPartnerServerFields).partial(),
})
export type UpdatePartnerRequest = z.infer<typeof ZUpdatePartnerRequest>

export const ZUpdatePartnerInput = ZUpdatePartnerRequest.omit({ orgId: true })
export type UpdatePartnerInput = z.infer<typeof ZUpdatePartnerInput>

export const ZUpdatePartnerResponse = ZBaseAPIResponse.extend({
    partner: ZPartner,
})
export type UpdatePartnerResponse = z.infer<typeof ZUpdatePartnerResponse>

// ---------- List (by org, with filters + pagination) ----------
export const ZPartnerStatusCounts = z.object({
    active: z.number().int(),
    pending: z.number().int(),
    invited: z.number().int(),
    suspended: z.number().int(),
    rejected: z.number().int(),
});
export type PartnerStatusCounts = z.infer<typeof ZPartnerStatusCounts>;
export const ZListPartnersRequest = z.object({
    orgId: z.string(),
    groupId: z.string().optional(),
    status: z.enum(PARTNER_STATUS).optional(),
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    desc: z.boolean().optional(),
})
export type ListPartnersRequest = z.infer<typeof ZListPartnersRequest>

export const ZListPartnersInput = ZListPartnersRequest.omit({ orgId: true })
export type ListPartnersInput = z.infer<typeof ZListPartnersInput>

export const ZListPartnersResponse = ZBaseAPIResponse
    .extend(ZPaginatedResponse(ZPartner).shape)
export type ListPartnersResponse = z.infer<typeof ZListPartnersResponse>

// ---------- Counts (per status, honouring the same filters as the list) ----------
export const ZPartnerCountsRequest = z.object({
    orgId: z.string(),
    groupId: z.string().optional(),
    search: z.string().trim().max(100).optional(),
})
export type PartnerCountsRequest = z.infer<typeof ZPartnerCountsRequest>

export const ZPartnerCountsInput = ZPartnerCountsRequest.omit({ orgId: true })
export type PartnerCountsInput = z.infer<typeof ZPartnerCountsInput>

export const ZPartnerCountsResponse = ZBaseAPIResponse.extend({
    counts: ZPartnerStatusCounts,
})
export type PartnerCountsResponse = z.infer<typeof ZPartnerCountsResponse>

export const ZPartnerStatusChange = z.discriminatedUnion("status", [
    z.object({ status: z.literal(PARTNER_STATUS.ACTIVE) }), // approve or reactivate
    z.object({ status: z.literal(PARTNER_STATUS.REJECTED), reason: z.string().trim().min(1).max(500) }),
    z.object({ status: z.literal(PARTNER_STATUS.SUSPENDED), reason: z.string().trim().min(1).max(500) }),
])
export type PartnerStatusChange = z.infer<typeof ZPartnerStatusChange>

export const ZChangePartnerStatusRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
    change: ZPartnerStatusChange,
})
export type ChangePartnerStatusRequest = z.infer<typeof ZChangePartnerStatusRequest>

export const ZChangePartnerStatusInput = ZChangePartnerStatusRequest.omit({ orgId: true })
export type ChangePartnerStatusInput = z.infer<typeof ZChangePartnerStatusInput>

export const ZChangePartnerStatusResponse = ZBaseAPIResponse.extend({
    partner: ZPartner,
})
export type ChangePartnerStatusResponse = z.infer<typeof ZChangePartnerStatusResponse>

// ---------- Delete ----------
export const ZDeletePartnerRequest = z.object({
    orgId: z.string(),
    partnerId: z.string(),
})
export type DeletePartnerRequest = z.infer<typeof ZDeletePartnerRequest>

export const ZDeletePartnerInput = ZDeletePartnerRequest.omit({ orgId: true })
export type DeletePartnerInput = z.infer<typeof ZDeletePartnerInput>

export const ZDeletePartnerResponse = ZBaseAPIResponse
export type DeletePartnerResponse = z.infer<typeof ZDeletePartnerResponse>