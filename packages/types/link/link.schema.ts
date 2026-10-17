import z from "zod";
import { URL_PARAMETER } from "../program/program.schema";

export const LINK_STATUS = {
    ACTIVE: "active",
    DISABLED: "disabled",
} as const;

export const ZLinkSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    orgId: z.string().optional(),
    programId: z.string(),
    partnerId: z.string(),
    code: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/, "Only letters, numbers, - and _"),
    // which query parameter the link uses to identify the partner (?ref=, ?via=, ?aff=)
    urlParam: z.enum(URL_PARAMETER).default(URL_PARAMETER.REF),
    status: z.enum(LINK_STATUS).default(LINK_STATUS.ACTIVE),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type LinkResource = z.infer<typeof ZLinkSchema>