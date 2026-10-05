import { z } from "zod";

export const PROGRAM_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
} as const;

export const PROGRAM_TYPE = {
    PUBLIC: "public",
    PRIVATE: "private",
} as const;

export const PROGRAM_COMMISSION_TYPE = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
} as const;

export const URL_PARAMETER = {
    REF: "ref",
    VIA: "via",
    AFF: "aff",
} as const;

export const PAYOUT_TERM = {
    NET_15: 15,
    NET_30: 30,
    NET_45: 45,
    NET_60: 60,
} as const;

export const PAYOUT_METHOD = {
    PAYPAL: "paypal",
    WISE: "wise"
} as const;

export const CUSTOMER_IDENTITY_VISIBILITY = {
    HIDE: "hide",
    EMAIL: "email",
    NAME_AND_EMAIL: "name_and_email"
} as const;

export const ZProgramResource = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    orgId: z.string().optional(),
    userId: z.string().optional(),
    name: z.string(),
    productName: z.string().optional().nullable(),
    status: z.enum(PROGRAM_STATUS).optional(),
    type: z.enum(PROGRAM_TYPE).optional(),
    payoutMinimumThreshold: z.number().min(0).optional(),
    payoutTerm: z.enum(PAYOUT_TERM).optional(),
    payoutMethods: z.array(z.enum(PAYOUT_METHOD)).optional(),
    cookieDuration: z.number().min(1).max(365).optional().nullable(),
    urlParams: z.array(z.enum(URL_PARAMETER)).optional().nullable(),
    autoApproveCommissions: z.boolean().optional(),
    blockSelfReferrals: z.boolean().optional(),
    couponParams: z.string().optional().nullable(),
    customerIdentifyVisiblity: z.enum(CUSTOMER_IDENTITY_VISIBILITY).nullable().optional(),
    restrictPersonalEmail: z.boolean().optional(),
    restrictCountries: z.array(z.string()).optional(),
    defaultGroupId: z.string().optional().nullable(),
    commissionType: z.enum(PROGRAM_COMMISSION_TYPE).optional().nullable(),
    commissionValue: z.number().optional().nullable(),
    currency: z.string().max(3).optional().nullable(),
    faviconUrl: z.string().optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    websiteUrl: z.string().optional(),
})

export type ProgramResource = z.infer<typeof ZProgramResource>;