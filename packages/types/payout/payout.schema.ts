import { z } from "zod";

export const PAYOUT_METHOD = {
    PAYPAL: "paypal",
    WISE: "wise",
} as const;

export type PayoutMethod = (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD];

export const ZPaypalPayoutDetails = z.object({
    email: z.email().trim().toLowerCase(),
});

export const ZWisePayoutDetails = z.object({
    email: z.email().trim().toLowerCase(),
});

// one schema per method; add bank fields etc. here later
export const PAYOUT_DETAILS_SCHEMA = {
    [PAYOUT_METHOD.PAYPAL]: ZPaypalPayoutDetails,
    [PAYOUT_METHOD.WISE]: ZWisePayoutDetails,
} as const;

export const ZPayoutDetails = z.union([ZPaypalPayoutDetails, ZWisePayoutDetails]);
export type PayoutDetails = z.infer<typeof ZPayoutDetails>;