import type { OrganizationResource } from "@rewardkit/packages/types/organization/organization.schema";
import { organizationRepository } from "@rewardkit/packages/features/organization/repository/organization.repository";
import { clerk } from "@rewardkit/packages/features/clerk/clerk.config";

export class OrganizationService {
    protected readonly _orgRepo = organizationRepository

    async createOrganization(data: OrganizationResource) {
        if (!data.orgId) return

        console.log("[OrganizationService]: Received org create request", data.orgId)

        try {
            const clerkOrg = await clerk.organizations.getOrganization({ organizationId: data.orgId })
            if (!clerkOrg) {
                console.warn("[OrganizationService]:  Organization record doesn't exist in clerk records ", data.orgId)
                return
            }

            const existingOrg = await this._orgRepo.get(data.orgId)
            if (existingOrg) {
                console.warn("[OrganizationService]:  Organization already exists")
                return
            }

            await this._orgRepo.create(data)

            console.log("[OrganizationService]: Completed org create request", data.orgId)
        } catch (err) {
            console.warn("[OrganizationService]: Failed to create org record for ", data.orgId)
            console.error("[OrganizationService]: createOrganization failed:", err)
            throw err
        }
    }
}

export const orgService = new OrganizationService()