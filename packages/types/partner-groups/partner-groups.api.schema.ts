import z from "zod"
import { ZBaseAPIResponse } from "../api/base.api.schema"
import { ZPartnerGroups } from "./partner-groups.schema"

// fields the server owns and the client should never send
const ZPartnerGroupServerFields = {
    _id: true,
    id: true,
    orgId: true,
    createdBy: true,
    programId: true,
    default: true,
    createdAt: true,
    updatedAt: true,
} as const

// orgId and userId come from the session on the server, never from the client

// ---------- Create ----------
export const ZCreatePartnerGroupRequest = z.object({
    orgId: z.string(),
    userId: z.string(), // stored as createdBy
    groupData: ZPartnerGroups.omit(ZPartnerGroupServerFields),
})
export type CreatePartnerGroupRequest = z.infer<typeof ZCreatePartnerGroupRequest>

export const ZCreatePartnerGroupInput = ZCreatePartnerGroupRequest.omit({ orgId: true, userId: true })
export type CreatePartnerGroupInput = z.infer<typeof ZCreatePartnerGroupInput>

export const ZCreatePartnerGroupResponse = ZBaseAPIResponse.extend({
    partnerGroup: ZPartnerGroups,
})
export type CreatePartnerGroupResponse = z.infer<typeof ZCreatePartnerGroupResponse>

// ---------- Get ----------
export const ZGetPartnerGroupRequest = z.object({
    orgId: z.string(),
    partnerGroupId: z.string(),
})
export type GetPartnerGroupRequest = z.infer<typeof ZGetPartnerGroupRequest>

export const ZGetPartnerGroupInput = ZGetPartnerGroupRequest.omit({ orgId: true })
export type GetPartnerGroupInput = z.infer<typeof ZGetPartnerGroupInput>

export const ZGetPartnerGroupResponse = ZBaseAPIResponse.extend({
    partnerGroup: ZPartnerGroups,
})
export type GetPartnerGroupResponse = z.infer<typeof ZGetPartnerGroupResponse>

// ---------- Update ----------
export const ZUpdatePartnerGroupRequest = z.object({
    orgId: z.string(),
    partnerGroupId: z.string(),
    groupData: ZPartnerGroups.omit(ZPartnerGroupServerFields).partial(),
})
export type UpdatePartnerGroupRequest = z.infer<typeof ZUpdatePartnerGroupRequest>

export const ZUpdatePartnerGroupInput = ZUpdatePartnerGroupRequest.omit({ orgId: true })
export type UpdatePartnerGroupInput = z.infer<typeof ZUpdatePartnerGroupInput>

export const ZUpdatePartnerGroupResponse = ZBaseAPIResponse.extend({
    partnerGroup: ZPartnerGroups,
})
export type UpdatePartnerGroupResponse = z.infer<typeof ZUpdatePartnerGroupResponse>

// ---------- List (by org) ----------
export const ZListPartnerGroupsRequest = z.object({
    orgId: z.string(),
})
export type ListPartnerGroupsRequest = z.infer<typeof ZListPartnerGroupsRequest>

export const ZListPartnerGroupsResponse = ZBaseAPIResponse.extend({
    partnerGroups: z.array(ZPartnerGroups),
})
export type ListPartnerGroupsResponse = z.infer<typeof ZListPartnerGroupsResponse>

// ---------- Set default ----------
export const ZSetDefaultPartnerGroupRequest = z.object({
    orgId: z.string(),
    partnerGroupId: z.string(),
})
export type SetDefaultPartnerGroupRequest = z.infer<typeof ZSetDefaultPartnerGroupRequest>

export const ZSetDefaultPartnerGroupInput = ZSetDefaultPartnerGroupRequest.omit({ orgId: true })
export type SetDefaultPartnerGroupInput = z.infer<typeof ZSetDefaultPartnerGroupInput>

export const ZSetDefaultPartnerGroupResponse = ZBaseAPIResponse.extend({
    partnerGroup: ZPartnerGroups,
})
export type SetDefaultPartnerGroupResponse = z.infer<typeof ZSetDefaultPartnerGroupResponse>

// ---------- Delete ----------
export const ZDeletePartnerGroupRequest = z.object({
    orgId: z.string(),
    partnerGroupId: z.string(),
})
export type DeletePartnerGroupRequest = z.infer<typeof ZDeletePartnerGroupRequest>

export const ZDeletePartnerGroupInput = ZDeletePartnerGroupRequest.omit({ orgId: true })
export type DeletePartnerGroupInput = z.infer<typeof ZDeletePartnerGroupInput>

export const ZDeletePartnerGroupResponse = ZBaseAPIResponse
export type DeletePartnerGroupResponse = z.infer<typeof ZDeletePartnerGroupResponse>