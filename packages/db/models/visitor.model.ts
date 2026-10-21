import mongoose from "mongoose";
import { VISITOR_STATUS, type VisitorResource } from "@rewardkit/packages/types/visitor/visitor.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const VisitorSchema = new mongoose.Schema<VisitorResource>({
    _id: idField(ID_PREFIX.visitor),
    programId: { type: String, required: true, index: true, ref: "Program" },
    partnerId: { type: String, required: true, index: true, ref: "Partner" },
    name: { type: String, trim: true, default: null },
    cookieDuration: { type: Number, min: 1, max: 365, default: null },
    countryCode: { type: String, uppercase: true, minlength: 2, maxlength: 2, default: null },
    deviceManufacturer: { type: String, trim: true, default: null },
    deviceModel: { type: String, trim: true, default: null },
    deviceOs: { type: String, trim: true, default: null },
    deviceOsVersion: { type: String, trim: true, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    firstSeenAt: { type: String, default: null },
    firstSeenPageUrl: { type: String, trim: true, default: null },
    firstSeenClickId: { type: String, default: null },
    lastSeenAt: { type: String, default: null },
    status: {
        type: String,
        enum: Object.values(VISITOR_STATUS),
        default: VISITOR_STATUS.ACTIVE,
        index: true,
    },
    isFlagged: { type: Boolean, default: false },
}, { timestamps: true })

VisitorSchema.index({ programId: 1, partnerId: 1 })
VisitorSchema.index({ programId: 1, lastSeenAt: -1 })

VisitorSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
VisitorSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Visitor: mongoose.Model<VisitorResource> =
    (mongoose.models.Visitor as mongoose.Model<VisitorResource>) ??
    mongoose.model<VisitorResource>("Visitor", VisitorSchema, "visitor")
