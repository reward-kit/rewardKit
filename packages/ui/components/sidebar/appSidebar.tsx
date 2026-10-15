import { Image } from '../image'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, } from '../sidebar'
import { SidebarNavClient } from './sidebar.nav.client'
import { SidebarProgramClient } from './sidebar.program.client'
import { ThemeToggle } from '@rewardkit/components/toggleTheme'

export const AppSidebar = async () => {
    return (
        <Sidebar className="top-(--header-height) md:hidden h-[calc(100svh-var(--header-height))]! px-1">
            <SidebarHeader className="flex flex-col gap-2 py-2">
                <Image src={"/svg/rewardkit.svg"} priority className="w-28" alt="RewardKit" />
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