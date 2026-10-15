import { auth } from '@clerk/nextjs/server'
import { OrganizationNotSelected } from '@rewardkit/components/organization/organization.not-selected'
import { AppBootGate } from '@rewardkit/packages/features/app/app-boot-gate'
import { AppHeader } from '@rewardkit/packages/ui/components/header/app-header'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const { sessionClaims, orgId } = await auth.protect()
    if (!sessionClaims?.metadata?.onboardingComplete) {
        redirect('/onboarding/new')
    }

    return (
        <AppBootGate>
            <div className="flex w-screen overflow-x-hidden h-svh flex-col [--header-height:4rem]">
                <AppHeader />
                <div className="w-full flex-1 pt-4">
                    {orgId ? children : <OrganizationNotSelected />}
                </div>
            </div>
        </AppBootGate>
    )
}