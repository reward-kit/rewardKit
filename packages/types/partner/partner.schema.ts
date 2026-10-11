import { z } from "zod";
import { PAYOUT_DETAILS_SCHEMA, PAYOUT_METHOD, ZPayoutDetails } from "../payout/payout.schema";

export const PARTNER_STATUS = {
    PENDING: "pending",
    ACTIVE: "active",
    REJECTED: "rejected",
    SUSPENDED: "suspended",
    INVITED: "invited",
} as const;

export const PARTNER_STATUS_OPTIONS = Object.entries(PARTNER_STATUS).map(
    ([key, value]) => ({
        label: key.charAt(0) + key.slice(1).toLowerCase(),
        value: value,
    })
);

export type PartnerStatus = (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS];

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

// Plain object with no refinements, so .omit() / .pick() / .partial() are safe
export const ZPartnerBase = z.object({
    ...partnerShape,
    tags: partnerShape.tags.default([]),
    status: partnerShape.status.default(PARTNER_STATUS.PENDING).optional(),
    payoutMethod: partnerShape.payoutMethod,
    payoutDetails: partnerShape.payoutDetails,
    rejectedAt: partnerShape.rejectedAt,
    rejectedReason: partnerShape.rejectedReason,
    suspendedAt: partnerShape.suspendedAt,
    suspendedReason: partnerShape.suspendedReason,
})

// Full shape with cross-field rules, used for responses
export const ZPartner = ZPartnerBase.superRefine((p, ctx) => {
    if (p.status !== PARTNER_STATUS.REJECTED && (p.rejectedAt || p.rejectedReason)) {
        ctx.addIssue({ code: "custom", path: ["status"], message: "Rejected fields set but status is not rejected" });
    }
    if (p.status !== PARTNER_STATUS.SUSPENDED && (p.suspendedAt || p.suspendedReason)) {
        ctx.addIssue({ code: "custom", path: ["status"], message: "Suspended fields set but status is not suspended" });
    }
    if (p.payoutMethod) {
        const result = PAYOUT_DETAILS_SCHEMA[p.payoutMethod].safeParse(p.payoutDetails);
        if (!result.success) {
            ctx.addIssue({
                code: "custom",
                path: ["payoutDetails"],
                message: `Invalid payout details for ${p.payoutMethod}`,
            });
        }
    } else if (p.payoutDetails) {
        ctx.addIssue({
            code: "custom",
            path: ["payoutMethod"],
            message: "Payout details set but no payout method",
        });
    }
});

export type PartnerResource = z.infer<typeof ZPartner>;