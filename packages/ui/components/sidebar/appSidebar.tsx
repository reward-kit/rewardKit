import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, } from '../sidebar'
import { SidebarNavClient } from './sidebar.nav.client'
import { SidebarProgramClient } from './sidebar.program.client'

export const AppSidebar = async () => {
    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
            <div className='px-2 pt-2'>
                <SidebarHeader className="flex gap-4">
                    <SidebarProgramClient />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarNavClient />
                </SidebarContent>
                <SidebarFooter>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}