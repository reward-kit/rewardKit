import { type UserResource } from "@rewardkit/packages/types/user/user.schema"
import { db } from "@rewardkit/packages/db/db"
import { connectDB } from "@rewardkit/packages/db/connectDB"

connectDB()

export class UserRepository {

    async create(data: UserResource) {
        await db.user.create(data)
    }

    async update(userId: string, data: Partial<UserResource>) {
        await db.user.findOneAndUpdate({ userId }, data, { returnDocument: "after" })
    }

    async get(userId: string) {
        return await db.user.findOne({ userId })
    }

    async updateRaw(userId: string, update: Record<string, unknown>) {
        return await db.user.findOneAndUpdate(
            { userId },
            { $set: update },
            { returnDocument: "after" }
        )
    }

    async delete(userId: string) {
        await db.user.findOneAndDelete({ userId })
    }

    async getDocCount() {
        return await db.user.countDocuments()
    }
}

export const userRepository = new UserRepository()