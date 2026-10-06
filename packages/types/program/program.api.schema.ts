import { ProgramResource, ZProgramResource } from "./program.schema"
import { BaseAPIResponse, ZBaseAPIResponse } from "../api/base.api.schema"
import z from "zod"

export const ZCreateProgramRequest = z.object({
    userId: z.string(),
    programData: ZProgramResource,
})
export type CreateProgramRequest = z.infer<typeof ZCreateProgramRequest>

export const ZCreateProgramInput = ZCreateProgramRequest.omit({ userId: true })
export type CreateProgramInput = z.infer<typeof ZCreateProgramInput>

export const ZCreateProgramResponse = ZBaseAPIResponse.extend({
    program: ZProgramResource,
})
export type CreateProgramResponse = z.infer<typeof ZCreateProgramResponse>

export const ZGetProgramRequest = z.object({
    programId: z.string,
})
export type GetProgramRequest = z.infer<typeof ZGetProgramRequest>

export const ZGetProgramResponse = ZBaseAPIResponse.extend({
    program: ZProgramResource,
})
export type GetProgramResponse = z.infer<typeof ZGetProgramResponse>

export const ZUpdateProgramRequest = z.object({
    programId: z.string(),
    programData: ZProgramResource.partial(),
})
export type UpdateProgramRequest = z.infer<typeof ZUpdateProgramRequest>

export const ZUpdateProgramResponse = ZBaseAPIResponse.extend({
    program: ZProgramResource,
})
export type UpdateProgramResponse = z.infer<typeof ZUpdateProgramResponse>

export type GetProgramByOrgIdRequest = {
    orgId: string
}
export type GetProgramByOrgIdResponse = BaseAPIResponse & {
    program: ProgramResource
}

export const ZListProgramsRequest = z.object({
    userId: z.string(),
});
export type ListProgramsRequest = z.infer<typeof ZListProgramsRequest>;

export const ZListProgramsResponse = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    programs: z.array(ZProgramResource),
});
export type ListProgramsResponse = z.infer<typeof ZListProgramsResponse>;

export const ZCheckSubdomainRequest = z.object({
    subdomain: z.string().min(3).max(63).regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/),
})
export type CheckSubdomainRequest = z.infer<typeof ZCheckSubdomainRequest>

export const ZCheckSubdomainResponse = ZBaseAPIResponse.extend({
    available: z.boolean(),
    reason: z.enum(["reserved", "taken"]).nullable(),
})
export type CheckSubdomainResponse = z.infer<typeof ZCheckSubdomainResponse>

export const ZDeleteProgramRequest = z.object({
    programId: z.string(),
    userId: z.string(),
})
export type DeleteProgramRequest = z.infer<typeof ZDeleteProgramRequest>

// what the client sends: userId comes from the session on the server
export const ZDeleteProgramInput = ZDeleteProgramRequest.omit({ userId: true })
export type DeleteProgramInput = z.infer<typeof ZDeleteProgramInput>

export const ZDeleteProgramResponse = ZBaseAPIResponse
export type DeleteProgramResponse = z.infer<typeof ZDeleteProgramResponse>