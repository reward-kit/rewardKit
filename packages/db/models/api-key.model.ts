import mongoose from "mongoose";
import { ID_PREFIX, idField, transform } from "../lib/id";
import { API_KEY_STATUS, ApiKeyResource } from "@rewardkit/packages/types/apiKey/api-key.schema";

const ApiKeySchema = new mongoose.Schema<ApiKeyResource>({
    _id: idField(ID_PREFIX.apiKey),
    orgId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    key: { type: String, required: true, index: true },
    scopes: { type: [String], default: [] },
    status: { type: String, enum: Object.values(API_KEY_STATUS), default: API_KEY_STATUS.ACTIVE, index: true },
    lastUsedAt: { type: String, default: null },
    expiresAt: { type: String },
    revokedAt: { type: String, default: null },
}, { timestamps: true, })

ApiKeySchema.set("toJSON", { virtuals: true, versionKey: false, transform })
ApiKeySchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const ApiKey: mongoose.Model<ApiKeyResource> =
    (mongoose.models.ApiKey as mongoose.Model<ApiKeyResource>) ??
    mongoose.model<ApiKeyResource>("ApiKey", ApiKeySchema, "api-key")