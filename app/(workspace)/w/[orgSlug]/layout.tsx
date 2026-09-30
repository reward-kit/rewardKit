import { SidebarProvider } from '@rewardkit/packages/ui/components/sidebar'
import { AppSidebar } from '@rewardkit/packages/ui/components/sidebar/appSidebar'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div>
                {children}
            </div>
        </SidebarProvider>
    )
}