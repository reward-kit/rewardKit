import mongoose from "mongoose";
import { type PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const PartnerGroupSchema = new mongoose.Schema<PartnerGroupsResource>({
    _id: idField(ID_PREFIX.group),
    orgId: { type: String, index: true },
    createdBy: { type: String, index: true },
    programId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, max: 200, trim: true, default: null },
    default: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    websiteUrl: { type: String, default: null },
    // no default on purpose: undefined = inherit the program's payoutMinimumThreshold
    payoutMinimumThreshold: { type: Number, min: 0 },
    allowManualLeadSubmission: { type: Boolean, default: false },
}, { timestamps: true })

// group names unique within a program
PartnerGroupSchema.index({ programId: 1, name: 1 }, { unique: true })

PartnerGroupSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
PartnerGroupSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const PartnerGroup: mongoose.Model<PartnerGroupsResource> =
    (mongoose.models.PartnerGroup as mongoose.Model<PartnerGroupsResource>) ??
    mongoose.model<PartnerGroupsResource>("PartnerGroup", PartnerGroupSchema, "partner_group")