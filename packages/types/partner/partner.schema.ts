import { z } from "zod";
import { PAYOUT_METHOD, ZPayoutDetails } from "../payout/payout.schema";
import { ZPartnerGroups } from "../partner-groups/partner-groups.schema";

export const PARTNER_STATUS = {
    PENDING: "pending",
    ACTIVE: "active",
    REJECTED: "rejected",
    SUSPENDED: "suspended",
    INVITED: "invited",
} as const;


const isoDate = z.iso.datetime();

const partnerShape = {
    _id: z.string().optional(),
    id: z.string().optional(),
    orgId: z.string().optional(),
    groupId: z.string().optional(),
    firstName: z.string().trim().min(1, "First name is required").max(50),
    lastName: z.string().trim().min(1, "Last name is required").max(50),
    email: z.email().trim().toLowerCase(),
    countryCode: z.string().length(2, "Use a 2-letter country code").regex(/^[A-Z]{2}$/, "Must be uppercase ISO code"),
    tags: z.array(z.string().trim().min(1)),
    companyName: z.string().max(50).nullable().optional(),
    status: z.enum(PARTNER_STATUS),
    payoutMethod: z.enum(PAYOUT_METHOD).nullable(),
    payoutDetails: ZPayoutDetails.nullable(),
    rejectedAt: isoDate.nullable(),
    rejectedReason: z.string().max(500).nullable(),
    suspendedAt: isoDate.nullable(),
    suspendedReason: z.string().max(500).nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
}

export const ZPartner = z.object({
    ...partnerShape,
    status: partnerShape.status.optional(),
    group: ZPartnerGroups.optional(),
})

export const ZPayoutFields = z.object({
    payoutMethod: partnerShape.payoutMethod,
    payoutDetails: z.record(z.string(), z.string()).nullable(),
})

export const ADMIN_PARTNER_STATUS = [
    PARTNER_STATUS.ACTIVE,
    PARTNER_STATUS.SUSPENDED,
    PARTNER_STATUS.REJECTED,
] as const;

export const ZPartnerStatusFields = z.object({
    status: z.enum(ADMIN_PARTNER_STATUS).nullable(),
    reason: z.string().max(500, "Reason must be 500 characters or fewer"),
})

export type AdminPartnerStatus = (typeof ADMIN_PARTNER_STATUS)[number];
export type PartnerResource = z.infer<typeof ZPartner>;
export type PartnerStatus = (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS];