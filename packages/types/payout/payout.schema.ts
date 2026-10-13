import { z } from "zod";

export const PAYOUT_METHOD = {
    PAYPAL: "paypal",
    WISE: "wise",
} as const;

export type PayoutMethod = (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD];

const ZPayoutEmail = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address"));

export const ZPaypalPayoutDetails = z.object({ email: ZPayoutEmail });
export const ZWisePayoutDetails = z.object({ email: ZPayoutEmail });

// one schema per method; add bank fields etc. here later
export const PAYOUT_DETAILS_SCHEMA = {
    [PAYOUT_METHOD.PAYPAL]: ZPaypalPayoutDetails,
    [PAYOUT_METHOD.WISE]: ZWisePayoutDetails,
} as const;

export const ZPayoutDetails = z.union([ZPaypalPayoutDetails, ZWisePayoutDetails]);
export type PayoutDetails = z.infer<typeof ZPayoutDetails>;