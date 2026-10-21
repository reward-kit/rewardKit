import mongoose from "mongoose";
import { type ClickResource } from "@rewardkit/packages/types/click/click.schema"

import { ID_PREFIX, idField, transform } from "../lib/id";

const ClickSchema = new mongoose.Schema<ClickResource>({
    _id: idField(ID_PREFIX.click),
    programId: { type: String, required: true, index: true, ref: "Program" },
    partnerId: { type: String, required: true, index: true, ref: "Partner" },
    linkId: { type: String, index: true, ref: "Link" },
    visitorId: { type: String, required: true, index: true, ref: "Visitor" },
    code: { type: String, trim: true, lowercase: true, default: null },
    page: { type: String, trim: true, default: null },
    param: { type: String, trim: true, default: null },
    referrer: { type: String, trim: true, default: null },
}, { timestamps: true })

// Reporting queries: "clicks for program X over a date range"
ClickSchema.index({ programId: 1, createdAt: -1 })

// Partner details / stats: "clicks for partner Y over a date range"
ClickSchema.index({ partnerId: 1, createdAt: -1 })

// Clicks for a single visitor (session timeline)
ClickSchema.index({ visitorId: 1 })

ClickSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
ClickSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Click: mongoose.Model<ClickResource> =
    (mongoose.models.Click as mongoose.Model<ClickResource>) ??
    mongoose.model<ClickResource>("Click", ClickSchema, "click")
