"use client"

import { usePartnerGroup } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroup"
import { Button } from "@rewardkit/packages/ui/components/button"
import { Dashboard, DashboardContent, DashboardDescription, DashboardHeader, DashboardTitle } from "@rewardkit/packages/ui/components/layout/dashboard.layout"
import { Small } from "@rewardkit/packages/ui/components/typography"
import Link from "next/link"
import { PartnerGroupEditForm } from "./partner-group.edit-form"

export const PartnerGroupDetailsPage = ({ groupId }: { groupId: string }) => {
    const { group, isLoading, isError, notFound } = usePartnerGroup(groupId)

    return (
        <Dashboard className="max-w-2xl mx-auto">
            <DashboardHeader className="px-7 gap-4">
                <div className="flex items-center justify-between gap-1">
                    <DashboardTitle>{group?.name ?? "Partner group"}</DashboardTitle>
                    <Button variant="outline" nativeButton={false} className="w-fit" size="xs" render={(props) => <Link {...props} href="/w/program/partner-groups" />}>
                        Back
                    </Button>
                </div>
                {group?.description && <DashboardDescription>{group.description}</DashboardDescription>}
            </DashboardHeader>
            <DashboardContent>
                {isLoading && <Small>Loading...</Small>}
                {isError && <Small>Failed to load this group.</Small>}
                {notFound && <Small>Group not found.</Small>}
                {/* key remounts the form with fresh initial values if the id ever changes */}
                {group && <PartnerGroupEditForm key={group.id} group={group} />}
            </DashboardContent>
        </Dashboard>
    )
}