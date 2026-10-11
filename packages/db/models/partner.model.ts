import mongoose from "mongoose";
import { PARTNER_STATUS, type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { PAYOUT_METHOD } from "@rewardkit/packages/types/payout/payout.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const PartnerSchema = new mongoose.Schema<PartnerResource>({
    _id: idField(ID_PREFIX.partner),
    orgId: { type: String, required: true, index: true },
    groupId: { type: String, ref: "PartnerGroup", index: true },
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, trim: true, maxlength: 50, default: null },
    countryCode: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
    tags: { type: [String], default: [] },
    status: {
        type: String,
        enum: Object.values(PARTNER_STATUS),
        default: PARTNER_STATUS.PENDING,
        index: true,
    },
    payoutMethod: { type: String, enum: Object.values(PAYOUT_METHOD), default: null },
    payoutDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    rejectedAt: { type: Date, default: null },
    rejectedReason: { type: String, maxlength: 500, trim: true, default: null },
    suspendedAt: { type: Date, default: null },
    suspendedReason: { type: String, maxlength: 500, trim: true, default: null },
}, { timestamps: true })

PartnerSchema.index({ orgId: 1, email: 1 }, { unique: true })
PartnerSchema.index({ orgId: 1, createdAt: -1, _id: -1 })
PartnerSchema.index({ orgId: 1, status: 1, createdAt: -1, _id: -1 })
PartnerSchema.index({ orgId: 1, groupId: 1, createdAt: -1, _id: -1 })

PartnerSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
PartnerSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Partner: mongoose.Model<PartnerResource> =
    (mongoose.models.Partner as mongoose.Model<PartnerResource>) ??
    mongoose.model<PartnerResource>("Partner", PartnerSchema, "partner")