import { ApiKeyResource, ZApiKey, } from "./api-key.schema"
import { BaseAPIResponse } from "../api/base.api.schema"
import z from "zod"

export type CreateApiKeyRequest = {
    orgId: string
    userId: string
    data: ApiKeyResource
}
export type CreateApiKeyResponse = BaseAPIResponse & {
    apiKey: ApiKeyResource
}

export type GetPermissionRequest = {
    apiKey: string
}
export type GetPermissionsResponse = BaseAPIResponse & {
    permissions: string[]
}

export const ZUpdateApiKey = ZApiKey
    .pick({ name: true, scopes: true })
    .extend({
        expiresAt: z.iso.datetime().nullable(),
    })
    .partial()
    .refine((v) => Object.keys(v).length > 0, { message: "Provide at least one field to update" })
    .refine((v) => !v.expiresAt || new Date(v.expiresAt) > new Date(), {
        message: "expiresAt must be in the future",
        path: ["expiresAt"],
    })
export type UpdateApiKeyBody = z.infer<typeof ZUpdateApiKey>

export type UpdateApiKeyRequest = {
    id: string
    orgId: string
    data: UpdateApiKeyBody
}
export type UpdateApiKeyResponse = BaseAPIResponse & {
    apiKey: ApiKeyResource
}