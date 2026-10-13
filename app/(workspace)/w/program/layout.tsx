import { auth } from '@clerk/nextjs/server'
import { OrganizationNotSelected } from '@rewardkit/components/organization/organization.not-selected'
import { AppBootGate } from '@rewardkit/packages/features/app/app-boot-gate'
import { AppHeader } from '@rewardkit/packages/ui/components/header/app-header'
import { SidebarProvider } from '@rewardkit/packages/ui/components/sidebar'
import { ProgramSidebar } from '@rewardkit/packages/ui/components/sidebar/program/program.sidebar'
import { H2, H3, Paragraph, Small } from '@rewardkit/packages/ui/components/typography'
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
                <div className='max-w-5xl mx-auto flex flex-col items-center py-8'>
                    <H2>Program</H2>
                    <Paragraph className='text-muted-foreground'>Manage your program</Paragraph>
                </div>
                <SidebarProvider className="relative mx-auto min-h-0 w-full max-w-5xl flex-1 px-4">
                    <ProgramSidebar />
                    <main className="min-w-0 flex-1 pt-4">
                        <div className="mx-auto max-w-3xl w-full">
                            {orgId ? children : <OrganizationNotSelected />}
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </AppBootGate>
    )
}