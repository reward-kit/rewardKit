import { db } from "@rewardkit/packages/db/db";
import { IS_PRODUCTION } from "@rewardkit/packages/env";
import { CreateApiKeyRequest, CreateApiKeyResponse, GetPermissionRequest, GetPermissionsResponse, UpdateApiKeyRequest, UpdateApiKeyResponse } from "@rewardkit/packages/types/apiKey/api-key.api.schema";
import { API_KEY_STATUS } from "@rewardkit/packages/types/apiKey/api-key.schema";
import { createHash, randomBytes } from "crypto";

export const API_KEY_PREFIX = IS_PRODUCTION ? "sk_live_" : "sk_test_"

export class ApiKeyService {
    private async generateApiKey() {
        const encoded = randomBytes(24).toString("base64url");
        const checksum = createHash("sha256")
            .update(encoded)
            .digest("base64url")
            .slice(0, 6);
        const secret = `${API_KEY_PREFIX}${encoded}_${checksum}`
        return secret
    }
    async createApiKey(apiKeyRequest: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
        const { userId, orgId } = apiKeyRequest
        const apiKey = await db.apiKey.create({ userId, orgId, key: await this.generateApiKey(), ...apiKeyRequest.data })
        return { success: true, apiKey }
    }

    async getPermissions(permissionRequest: GetPermissionRequest): Promise<GetPermissionsResponse> {
        const apiKey = await db.apiKey.findOne({ key: permissionRequest.apiKey }).lean()
        if (!apiKey || apiKey.status !== API_KEY_STATUS.ACTIVE || (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date())) {
            return { success: false, permissions: [] }
        }
        return { success: true, permissions: apiKey?.scopes ?? [] }
    }

    async verifyApiKey(apiKey: string) {
        const key = await db.apiKey.findOne({ key: apiKey, status: API_KEY_STATUS.ACTIVE, revokedAt: null }).lean()
        if (!key) return null
        if (key.expiresAt && new Date(key.expiresAt) < new Date()) return null
        void db.apiKey.updateOne({ _id: key._id }, { lastUsedAt: new Date() }).catch(() => { })
        return { userId: key.userId, orgId: key.orgId, permissions: key.scopes ?? [] }
    }

    async updateApiKey({ id, orgId, data }: UpdateApiKeyRequest): Promise<UpdateApiKeyResponse | null> {
        const apiKey = await db.apiKey.findOneAndUpdate(
            { _id: id, orgId, status: API_KEY_STATUS.ACTIVE },
            { $set: data },
            { returnDocument: "after", runValidators: true }
        )
        if (!apiKey) return null
        return { success: true, apiKey }
    }

    async revokeApiKey({ id, orgId }: { id: string, orgId: string }): Promise<boolean> {
        const apiKey = await db.apiKey.findOneAndUpdate(
            { _id: id, orgId, status: API_KEY_STATUS.ACTIVE },
            { $set: { status: API_KEY_STATUS.REVOKED, revokedAt: new Date() } },
            { returnDocument: "after" }
        )
        return !!apiKey
    }
}

export const apiKeyService = new ApiKeyService()