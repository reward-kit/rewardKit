import mongoose from "mongoose";
import { LINK_STATUS, type LinkResource } from "@rewardkit/packages/types/link/link.schema"
import { URL_PARAMETER } from "@rewardkit/packages/types/program/program.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const LinkSchema = new mongoose.Schema<LinkResource>({
    _id: idField(ID_PREFIX.link),
    orgId: { type: String, required: true, index: true },
    programId: { type: String, ref: "Program", required: true },
    partnerId: { type: String, ref: "Partner", required: true },
    code: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 32,
    },
    // the query parameter the tracking link uses; restricted to the program's allowed params
    urlParam: {
        type: String,
        enum: Object.values(URL_PARAMETER),
        default: URL_PARAMETER.REF,
    },
    status: {
        type: String,
        enum: Object.values(LINK_STATUS),
        default: LINK_STATUS.ACTIVE,
        index: true,
    },
}, { timestamps: true })

// Uniqueness: one code per program (used by tracking to resolve ?ref=code)
LinkSchema.index({ programId: 1, code: 1 }, { unique: true })

// Partner dashboard: "my links in this program"
LinkSchema.index({ orgId: 1, partnerId: 1, programId: 1 })

// Admin list view, newest first (same pagination pattern as Partner)
LinkSchema.index({ orgId: 1, createdAt: -1, _id: -1 })

// Partner details > Links tab: "this partner's links", newest first.
// (A partner can now have more than one link/campaign - the old
// one-link-per-partner unique index was removed when the Links tab landed.)
LinkSchema.index({ orgId: 1, partnerId: 1, createdAt: -1 })

LinkSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
LinkSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Link: mongoose.Model<LinkResource> =
    (mongoose.models.Link as mongoose.Model<LinkResource>) ??
    mongoose.model<LinkResource>("Link", LinkSchema, "link")