import mongoose from "mongoose";
import type { OrganizationResource } from "@rewardkit/packages/types/organization/organization.schema"
import { timestampPlugin } from "@rewardkit/packages/db/plugin/timestamps.plugin";

const OrganizationSchema = new mongoose.Schema<OrganizationResource>({
    orgId: { type: String, default: null, unique: true, index: true },
    name: { type: String, default: null, },
    slug: { type: String, default: null },
    createdBy: { type: String, default: null },
    imageUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, })

OrganizationSchema.plugin(timestampPlugin)

OrganizationSchema.set("toJSON", { virtuals: true })
OrganizationSchema.set("toObject", { virtuals: true })

export const Organization: mongoose.Model<OrganizationResource> =
    (mongoose.models.Organization as mongoose.Model<OrganizationResource>) ??
    mongoose.model<OrganizationResource>("Organization", OrganizationSchema, "organization")