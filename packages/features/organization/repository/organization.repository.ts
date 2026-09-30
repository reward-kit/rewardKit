import type { OrganizationResource } from "@rewardkit/packages/types/organization/organization.schema"
import { db } from "@rewardkit/packages/db/db"
import { connectDB } from "@rewardkit/packages/db/connectDB"

connectDB()

export class OrganizationRepository {
    async create(data: OrganizationResource) {
        await db.organization.create(data)
    }

    async update(orgId: string, data: Partial<OrganizationResource>) {
        await db.organization.findOneAndUpdate({ orgId: orgId }, data, { returnDocument: "after" })
    }

    async get(orgId: string){
        return await db.organization.findOne({ orgId: orgId })
    }

    async delete(orgId: string){
        await db.organization.findOneAndDelete({orgId: orgId })
    }
}

export const organizationRepository = new OrganizationRepository()