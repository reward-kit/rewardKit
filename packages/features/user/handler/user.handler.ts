import type { GenericWebhookEvent } from "@rewardkit/packages/webhook/types";
import type { UserJSON } from "@clerk/backend";
import { userService } from "@rewardkit/packages/features/user/service/user.service";
import type { UserResource } from "@rewardkit/packages/types/user/user.schema";
// import { planService } from "@snappin/features/billing/service/plan.service";
// import { polar } from "@snappin/features/orpc/config/polar";

export class UserHandler {
    protected _userService = userService;

    /**
     * Create user
     * @param event 
     */
    async create(event: GenericWebhookEvent): Promise<void> {
        // Extract user from event
        const user = event.payload as UserJSON;

        // const freeProduct = await planService.getFreeProduct()
        // let billingCustomerId = null
        // if (freeProduct?.polarProductId) {
        //     const customer = await polar.customers.create({
        //         externalId: user.id,
        //         email: user.email_addresses[0]?.email_address ?? "",
        //         name: user.first_name + " " + user.last_name,
        //     })

        //     billingCustomerId = customer.id

        //     await polar.subscriptions.create({
        //         productId: freeProduct.polarProductId,
        //         externalCustomerId: user.id,
        //     })
        // }

        // Create user payload

        const email = user.email_addresses[0]?.email_address ?? "";

        const payload: UserResource = {
            userId: user.id,
            email: user.email_addresses[0]?.email_address ?? "",
            imageUrl: user.image_url ?? null,
            fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : email.split("@")[0],
            // billingAccount: {
            //     customerId: billingCustomerId
            // }
        }
        // Create user
        await this._userService.createUser(payload)
    }
}