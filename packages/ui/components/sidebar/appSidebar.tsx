import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, } from '../sidebar'
import { SidebarNavClient } from './sidebar.nav.client'
import { SidebarProgramClient } from './sidebar.program.client'
import { ThemeToggle } from '@rewardkit/components/toggleTheme'

export const AppSidebar = async () => {
    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]! px-1">
            <SidebarHeader className="flex">
                <SidebarProgramClient />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNavClient />
            </SidebarContent>
            <SidebarFooter>
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}