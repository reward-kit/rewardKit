import mongoose from "mongoose";
import { type ProgramResource, PAYOUT_METHOD, PAYOUT_TERM, PROGRAM_COMMISSION_TYPE, PROGRAM_STATUS, PROGRAM_TYPE } from "@rewardkit/packages/types/program/program.schema"
import { ID_PREFIX, idField, transform } from "../lib/id";

const ProgramSchema = new mongoose.Schema<ProgramResource>({
    _id: idField(ID_PREFIX.program),
    orgId: { type: String, index: true },
    userId: { type: String, index: true },
    name: { type: String, default: null },
    status: { type: String, default: PROGRAM_STATUS.ACTIVE, enum: Object.values(PROGRAM_STATUS) },
    type: { type: String, default: PROGRAM_TYPE.PUBLIC, enum: Object.values(PROGRAM_TYPE) },
    payoutMinimumThreshold: { type: Number, default: 0 },
    payoutTerm: { type: Number, default: PAYOUT_TERM.NET_30, enum: Object.values(PAYOUT_TERM) },
    payoutMethods: { type: [String], default: [PAYOUT_METHOD.PAYPAL], enum: Object.values(PAYOUT_METHOD) },
    cookieDuration: { type: Number, default: 30 },
    urlParams: { type: String, default: null },
    autoApproveCommissions: { type: Boolean, default: true },
    blockSelfReferrals: { type: Boolean, default: true },
    couponParams: { type: String, default: null },
    hideCustomerEmails: { type: Boolean, default: true },
    restrictPersonalEmail: { type: Boolean, default: false },
    restrictCountries: { type: [String], default: [] },
    defaultGroupId: { type: String, default: null },
    commissionType: { type: String, default: null, enum: Object.values(PROGRAM_COMMISSION_TYPE) },
    commissionValue: { type: Number, default: null },
    faviconUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
}, { timestamps: true, })

ProgramSchema.set("toJSON", { virtuals: true, versionKey: false, transform })
ProgramSchema.set("toObject", { virtuals: true, versionKey: false, transform })

export const Program: mongoose.Model<ProgramResource> =
    (mongoose.models.Program as mongoose.Model<ProgramResource>) ??
    mongoose.model<ProgramResource>("Program", ProgramSchema, "program")