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

export const PAYOUT_TERM = {
    NET_15: 15,
    NET_30: 30,
    NET_45: 45,
    NET_60: 60,
} as const;

export const PAYOUT_METHOD = {
    PAYPAL: "paypal",
} as const;

export const ZProgramResource = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    orgId: z.string().optional(),
    userId: z.string().optional(),
    name: z.string(),
    status: z.enum(PROGRAM_STATUS).optional(),
    type: z.enum(PROGRAM_TYPE).optional(),
    payoutMinimumThreshold: z.number().optional(),
    payoutTerm: z.enum(PAYOUT_TERM).optional(),
    payoutMethods: z.array(z.enum(PAYOUT_METHOD)).optional(),
    cookieDuration: z.number().optional().nullable(),
    urlParams: z.string().optional().nullable(),
    autoApproveCommissions: z.boolean().optional(),
    blockSelfReferrals: z.boolean().optional(),
    couponParams: z.string().optional(),
    hideCustomerEmails: z.boolean().optional(),
    restrictPersonalEmail: z.boolean().optional(),
    restrictCountries: z.array(z.string()).optional(),
    defaultGroupId: z.string().optional(),
    commissionType: z.enum(PROGRAM_COMMISSION_TYPE).optional(),
    commissionValue: z.number().optional(),
    faviconUrl: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    websiteUrl: z.string().optional(),
})

export type ProgramResource = z.infer<typeof ZProgramResource>;