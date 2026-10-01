import z from "zod";

export const permissionsMetadataSchema = z.object({
    requiredPermissions: z.array(z.string()).optional(),
});