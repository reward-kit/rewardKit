import { auth } from '@clerk/nextjs/server'
import { OrganizationNotSelected } from '@rewardkit/components/organization/organization.not-selected'
import { SidebarProvider, SidebarInset } from '@rewardkit/packages/ui/components/sidebar'
import { AppHeader } from '@rewardkit/packages/ui/components/sidebar/app.header'
import { AppHeaderMobile } from '@rewardkit/packages/ui/components/sidebar/app.header.mobile'
import { AppSidebar } from '@rewardkit/packages/ui/components/sidebar/appSidebar'
import {  redirect } from 'next/navigation'
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
        <div className="flex w-screen overflow-x-hidden h-svh flex-col [--header-height:3rem]">
            <AppHeader />
            <SidebarProvider className="min-h-0 flex-1">
                <AppSidebar />
                <SidebarInset className="overflow-auto overflow-x-hidden">
                    <AppHeaderMobile enableSidebarTrigger />
                    <div>{orgId ? children : <OrganizationNotSelected />}</div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}