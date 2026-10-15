import { z } from "zod";
import { toMinorUnits } from "@rewardkit/lib/amount/money";
import { normalizeWebsiteUrl, ZWebsiteUrl } from "../website/website.schema";
import { PAYOUT_METHOD } from "../payout/payout.schema";
import {
    CUSTOMER_IDENTITY_VISIBILITY,
    PAYOUT_TERM,
    PROGRAM_STATUS,
    URL_PARAMETER,
} from "./program.schema";

/**
 * Form validators for the program settings.
 *
 * Amounts are handled as minor units (integer cents) everywhere (schema, DB, API).
 * The form field holds major units as a string: `z.input` is the string, `z.output`
 * is the minor-unit number. See `ZProgramPayoutMinimumThreshold`.
 */

type PayoutTerm = (typeof PAYOUT_TERM)[keyof typeof PAYOUT_TERM];

/* -------------------------------------------------------------------------- */
/*  General                                                                   */
/* -------------------------------------------------------------------------- */

export const ZProgramName = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Maximum of 100 characters"),
});

export type ProgramNameFormValues = z.input<typeof ZProgramName>;
export type ProgramNameValues = z.output<typeof ZProgramName>;

export const ZProgramProductName = z.object({
    productName: z
        .string()
        .trim()
        .min(1, "Product name is required")
        .max(100, "Maximum of 100 characters"),
});

export type ProgramProductNameFormValues = z.input<typeof ZProgramProductName>;
export type ProgramProductNameValues = z.output<typeof ZProgramProductName>;

export const ZProgramWebsite = z.object({
    // accepts "acme.com" and stores "https://acme.com"
    websiteUrl: z.string().trim().transform(normalizeWebsiteUrl).pipe(ZWebsiteUrl),
});

export type ProgramWebsiteFormValues = z.input<typeof ZProgramWebsite>;
export type ProgramWebsiteValues = z.output<typeof ZProgramWebsite>;

export const ZProgramCurrency = z.object({
    currency: z.string().trim().length(3, "Select a currency"),
});

export type ProgramCurrencyFormValues = z.input<typeof ZProgramCurrency>;
export type ProgramCurrencyValues = z.output<typeof ZProgramCurrency>;

export const ZProgramStatus = z.object({
    status: z.enum(PROGRAM_STATUS),
});

export type ProgramStatusFormValues = z.input<typeof ZProgramStatus>;
export type ProgramStatusValues = z.output<typeof ZProgramStatus>;

/* -------------------------------------------------------------------------- */
/*  Payout                                                                    */
/* -------------------------------------------------------------------------- */

export const ZProgramPayoutMinimumThreshold = z.object({
    payoutMinimumThreshold: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || toMinorUnits(v) !== null,
            "Enter a valid amount, up to 2 decimals",
        )
        // the field holds major units; the API gets minor units (integer cents)
        .transform((v) => toMinorUnits(v)),
});

// what the form holds (string)
export type ProgramPayoutMinimumThresholdFormValues = z.input<typeof ZProgramPayoutMinimumThreshold>;
// what the API gets (number | null)
export type ProgramPayoutMinimumThresholdValues = z.output<typeof ZProgramPayoutMinimumThreshold>;

export const ZProgramPayoutTerm = z.object({
    payoutTerm: z
        .string()
        .refine(
            (v) => Object.values(PAYOUT_TERM).some((term) => String(term) === v),
            "Select a payout term",
        )
        .transform((v) => Number(v) as PayoutTerm),
});

export type ProgramPayoutTermFormValues = z.input<typeof ZProgramPayoutTerm>;
export type ProgramPayoutTermValues = z.output<typeof ZProgramPayoutTerm>;

export const ZProgramPayoutMethods = z.object({
    payoutMethods: z
        .array(z.enum(PAYOUT_METHOD))
        .min(1, "Select at least one payout method"),
});

export type ProgramPayoutMethodsFormValues = z.input<typeof ZProgramPayoutMethods>;
export type ProgramPayoutMethodsValues = z.output<typeof ZProgramPayoutMethods>;

/* -------------------------------------------------------------------------- */
/*  Tracking & safeguard                                                       */
/* -------------------------------------------------------------------------- */

export const ZProgramCookieDuration = z.object({
    // the field holds the day count as a string; the API gets a number (or null for no expiry)
    cookieDuration: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 365),
            "Enter a duration between 1 and 365 days",
        )
        .transform((v) => (v === "" ? null : Number(v))),
});

export type ProgramCookieDurationFormValues = z.input<typeof ZProgramCookieDuration>;
export type ProgramCookieDurationValues = z.output<typeof ZProgramCookieDuration>;

export const ZProgramUrlParams = z.object({
    urlParams: z
        .array(z.enum(URL_PARAMETER))
        .min(1, "Select at least one URL parameter"),
});

export type ProgramUrlParamsFormValues = z.input<typeof ZProgramUrlParams>;
export type ProgramUrlParamsValues = z.output<typeof ZProgramUrlParams>;

export const ZProgramBlockSelfReferrals = z.object({
    blockSelfReferrals: z.boolean(),
});

export type ProgramBlockSelfReferralsFormValues = z.input<typeof ZProgramBlockSelfReferrals>;
export type ProgramBlockSelfReferralsValues = z.output<typeof ZProgramBlockSelfReferrals>;

export const ZProgramRestrictPersonalEmail = z.object({
    restrictPersonalEmail: z.boolean(),
});

export type ProgramRestrictPersonalEmailFormValues = z.input<typeof ZProgramRestrictPersonalEmail>;
export type ProgramRestrictPersonalEmailValues = z.output<typeof ZProgramRestrictPersonalEmail>;

export const ZProgramRestrictCountries = z.object({
    restrictCountries: z.array(z.string()),
});

export type ProgramRestrictCountriesFormValues = z.input<typeof ZProgramRestrictCountries>;
export type ProgramRestrictCountriesValues = z.output<typeof ZProgramRestrictCountries>;

export const ZProgramCustomerVisibility = z.object({
    customerIdentifyVisiblity: z.enum(CUSTOMER_IDENTITY_VISIBILITY),
});

export type ProgramCustomerVisibilityFormValues = z.input<typeof ZProgramCustomerVisibility>;
export type ProgramCustomerVisibilityValues = z.output<typeof ZProgramCustomerVisibility>;
