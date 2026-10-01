import mongoose from "mongoose";
import type { UserResource } from "@rewardkit/packages/types/user/user.schema"
import { timestampPlugin } from "@rewardkit/packages/db/plugin/timestamps.plugin";

const UserSchema = new mongoose.Schema<UserResource>({
    userId: { type: String, default: null, index: true },
    email: { type: String, default: null, unique: true, index: true },
    fullName: { type: String, default: null },
    profileUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
})

UserSchema.plugin(timestampPlugin)

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })

export const User: mongoose.Model<UserResource> =
    (mongoose.models.User as mongoose.Model<UserResource>) ??
    mongoose.model<UserResource>("User", UserSchema, "user")