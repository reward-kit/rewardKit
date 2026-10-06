import mongoose from "mongoose";
import { type ProgramResource, CUSTOMER_IDENTITY_VISIBILITY, PAYOUT_METHOD, PAYOUT_TERM, PROGRAM_COMMISSION_TYPE, PROGRAM_STATUS, PROGRAM_TYPE, URL_PARAMETER } from "@rewardkit/packages/types/program/program.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const ProgramSchema = new mongoose.Schema<ProgramResource>({
    _id: idField(ID_PREFIX.program),
    orgId: { type: String, index: true },
    userId: { type: String, index: true },
    name: { type: String, default: null },
    productName: { type: String, default: null },
    status: { type: String, default: PROGRAM_STATUS.ACTIVE, enum: Object.values(PROGRAM_STATUS) },
    type: { type: String, default: PROGRAM_TYPE.PUBLIC, enum: Object.values(PROGRAM_TYPE) },
    payoutMinimumThreshold: { type: Number, default: 0, min: 0 },
    payoutTerm: { type: Number, default: PAYOUT_TERM.NET_30, enum: Object.values(PAYOUT_TERM) },
    payoutMethods: { type: [String], default: [PAYOUT_METHOD.PAYPAL], enum: Object.values(PAYOUT_METHOD) },
    cookieDuration: { type: Number, default: 30, max: 365, min: 1 },
    urlParams: { type: [String], default: [URL_PARAMETER.AFF], enum: Object.values(URL_PARAMETER) },
    autoApproveCommissions: { type: Boolean, default: true },
    blockSelfReferrals: { type: Boolean, default: true },
    couponParams: { type: String, default: null },
    customerIdentifyVisiblity: { type: String, default: CUSTOMER_IDENTITY_VISIBILITY.HIDE, enum: Object.values(CUSTOMER_IDENTITY_VISIBILITY) },
    restrictPersonalEmail: { type: Boolean, default: false },
    restrictCountries: { type: [String], default: [] },
    defaultGroupId: { type: String, default: null },
    commissionType: { type: String, default: null, enum: Object.values(PROGRAM_COMMISSION_TYPE) },
    commissionValue: { type: Number, default: null },
    currency: { type: String, default: "USD", uppercase: true, minlength: 3, maxlength: 3 },
    faviconUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
    subdomain: { type: String, defualt: null }
}, { timestamps: true, })

ProgramSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
ProgramSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Program: mongoose.Model<ProgramResource> =
    (mongoose.models.Program as mongoose.Model<ProgramResource>) ??
    mongoose.model<ProgramResource>("Program", ProgramSchema, "program")