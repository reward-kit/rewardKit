import { clerk } from "@rewardkit/packages/features/clerk/clerk.config";
import type { UserResource } from "@rewardkit/packages/types/user/user.schema";
import { userRepository } from "@rewardkit/packages/features/user/repository/user.repository";
// import { resend } from "@usemagic/features/user/@usemagic/features/user/config/resend";
// import { IS_PRODUCTION } from "@usemagic/env";

export class UserService {
    protected readonly _userRepo = userRepository

    async createUser(data: UserResource) {
        if (!data.userId) return

        console.log("[UserService]: Received user create request", data.userId)

        try {
            // validate user exist in clerk 
            const clerkUser = await clerk.users.getUser(data.userId);
            if (!clerkUser) {
                console.warn("[UserService]:  User record doesn't exist in clerk", data.userId)
                return
            }
            // Check if user already exists
            const existingUser = await this._userRepo.get(data.userId);
            if (existingUser) {
                console.warn("[UserService]:  User already exists ", existingUser._id.toString(), " ", data.userId)
                return
            }


            await this._userRepo.create(data)

            console.log("[UserService]: Completed user create request", data.userId)
        } catch (err) {
            console.warn("[UserService]: Failed to create user record for ", data.userId)
            console.error("[UserService]: createUser failed:", err)
            throw err
        }
    }
}

export const userService = new UserService()