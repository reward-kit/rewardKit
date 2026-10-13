import { z } from "zod";
import { PAYOUT_DETAILS_SCHEMA, PayoutMethod } from "../payout/payout.schema";
import { AdminPartnerStatus, PARTNER_STATUS, ZPartner, ZPartnerStatusFields, ZPayoutFields } from "./partner.schema";

const refinePayout = (p: z.infer<typeof ZPayoutFields>, ctx: z.RefinementCtx) => {
    if (!p.payoutMethod) {
        ctx.addIssue({ code: "custom", path: ["payoutMethod"], message: "Select a payout method" })
        return
    }

    const result = PAYOUT_DETAILS_SCHEMA[p.payoutMethod].safeParse(p.payoutDetails ?? {})
    if (!result.success) {
        for (const issue of result.error.issues) {
            ctx.addIssue({
                code: "custom",
                path: ["payoutDetails", ...issue.path],
                message: issue.message,
            })
        }
    }
}

export const ZPartnerPayout = ZPayoutFields
    .superRefine(refinePayout)
    .transform((p) => {
        const method = p.payoutMethod as PayoutMethod
        return {
            payoutMethod: method,
            payoutDetails: PAYOUT_DETAILS_SCHEMA[method].parse(p.payoutDetails),
        }
    })

export type PartnerPayoutValues = z.infer<typeof ZPartnerPayout>

const refinePartner = (p: z.infer<typeof ZPartner>, ctx: z.RefinementCtx) => {
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
        ctx.addIssue({ code: "custom", path: ["payoutMethod"], message: "Payout details set but no payout method" });
    }
}

export const ZPartnerValidated = ZPartner.superRefine(refinePartner)

export const ZPartnerStatus = ZPartnerStatusFields
    .superRefine((v, ctx) => {
        if (!v.status) {
            ctx.addIssue({ code: "custom", path: ["status"], message: "Select a status" })
        }
    })
    .transform((v) => {
        const status = v.status as AdminPartnerStatus
        const reason = v.reason.trim()
        return status === PARTNER_STATUS.ACTIVE
            ? { status }
            : { status, reason: reason || undefined }
    })

export type PartnerStatusValues = z.infer<typeof ZPartnerStatus>