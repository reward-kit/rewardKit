"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"

export type ClerkAuthData = {
    userId: string | null
    orgId: string | undefined
    orgRole: string | undefined
    user: {
        id: string
        email: string | null
        firstName: string | null
        lastName: string | null
        fullName: string | null
        imageUrl: string | null
    } | null
    organization: {
        id: string
        name: string
        slug: string | null
        imageUrl: string | null
    } | null
    memberships: Array<{
        id: string
        name: string
        slug: string | null
        imageUrl: string | null
    }>
}

export async function useClerkAuth(): Promise<ClerkAuthData> {
    const { userId, orgId, orgRole } = await auth()

    if (!userId) {
        return {
            userId: null,
            orgId: undefined,
            orgRole: undefined,
            user: null,
            organization: null,
            memberships: [],
        }
    }

    const client = await clerkClient()

    const [organizationMemberships, organization, clerkUser] = await Promise.all([
        client.users.getOrganizationMembershipList({ userId }),
        orgId ? client.organizations.getOrganization({ organizationId: orgId }) : Promise.resolve(null),
        client.users.getUser(userId),  // ← Added user fetch
    ])

    return {
        userId,
        orgId,
        orgRole,
        user: clerkUser
            ? {
                id: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                fullName: clerkUser.fullName,
                imageUrl: clerkUser.imageUrl,
            }
            : null,
        organization: organization
            ? {
                id: organization.id,
                name: organization.name,
                slug: organization.slug,
                imageUrl: organization.imageUrl,
            }
            : null,
        memberships: organizationMemberships.data.map((m) => ({
            id: m.organization.id,
            name: m.organization.name,
            slug: m.organization.slug,
            imageUrl: m.organization.imageUrl,
        })),
    }
}