import { SidebarProvider, SidebarInset } from '@rewardkit/packages/ui/components/sidebar'
import { AppHeader } from '@rewardkit/packages/ui/components/sidebar/app.header'
import { AppHeaderMobile } from '@rewardkit/packages/ui/components/sidebar/app.header.mobile'
import { AppSidebar } from '@rewardkit/packages/ui/components/sidebar/appSidebar'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen overflow-x-hidden h-svh flex-col [--header-height:3rem]">
            <AppHeader />
            <SidebarProvider className="min-h-0 flex-1">
                <AppSidebar />
                <SidebarInset className="overflow-auto overflow-x-hidden">
                    <AppHeaderMobile />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}