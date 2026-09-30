import z from "zod"


export const ZOrganization = z.object({
    _id: z.string().optional(),
    orgId: z.string().optional(),
    name: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
})

export type OrganizationResource = z.infer<typeof ZOrganization>