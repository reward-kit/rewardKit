import z from "zod";
import { ZWebsiteUrl } from "../website/website.schema";

export const ZPartnerGroups = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    orgId: z.string().optional(),
    createdBy: z.string().optional(),
    name: z.string().trim().min(1, "Group name is required").max(60),
    description: z.string().trim().max(200).optional().nullable(),
    programId: z.string().optional(),
    default: z.boolean().optional(),
    isPrivate: z.boolean().optional(),
    websiteUrl: ZWebsiteUrl.optional().nullable(),
    payoutMinimumThreshold: z.number().min(0).optional(),
    allowManualLeadSubmission: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type PartnerGroupsResource = z.infer<typeof ZPartnerGroups>