import { type OrganizationJSON } from "@clerk/backend";
import type { GenericWebhookEvent } from "@rewardkit/packages/webhook/types";
import { orgService } from "@rewardkit/packages/features/organization/service/organization.service";

export class OrganizationHandler {
    private readonly _orgService = orgService

    async create(event: GenericWebhookEvent): Promise<void> {
        const org = event.payload as OrganizationJSON;
        await this._orgService.createOrganization({
            orgId: org.id,
            name: org.name,
            slug: org.slug,
            createdBy: org.created_by,
            imageUrl: org.image_url
        });
    }
}