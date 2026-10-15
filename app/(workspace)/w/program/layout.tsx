import { auth } from '@clerk/nextjs/server'
import { OrganizationNotSelected } from '@rewardkit/components/organization/organization.not-selected'
import { AppBootGate } from '@rewardkit/packages/features/app/app-boot-gate'
import { AppHeader } from '@rewardkit/packages/ui/components/header/app-header'
import { SidebarProvider } from '@rewardkit/packages/ui/components/sidebar'
import { ProgramSidebar } from '@rewardkit/packages/ui/components/sidebar/program/program.sidebar'
import { ProgramNavTabs } from '@rewardkit/packages/ui/components/sidebar/program/program.nav.client'
import { H2, H3, Paragraph, Small } from '@rewardkit/packages/ui/components/typography'
import { redirect } from 'next/navigation'
import React from 'react'
import { AppHeaderMobile } from '@rewardkit/packages/ui/components/sidebar/app.header.mobile'
import { AppSidebar } from '@rewardkit/packages/ui/components/sidebar/appSidebar'

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
                <SidebarProvider className="relative mx-auto min-h-0 w-full flex flex-col max-w-177 flex-1">
                    <AppHeaderMobile enableSidebarTrigger />
                    <AppSidebar />
                    <main className="min-w-0 flex-1 pt-4">
                        <div className="mx-auto pb-12 w-full">
                            <div className='flex flex-col items-center py-8'>
                                <H2>Program</H2>
                                <Paragraph className='text-muted-foreground'>Manage your program</Paragraph>
                            </div>
                            <ProgramNavTabs />
                            <div className='px-4'>
                                {orgId ? children : <OrganizationNotSelected />}
                            </div>
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </AppBootGate>
    )
}