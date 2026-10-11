"use client"
import Link from 'next/link'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
} from '@rewardkit/packages/ui/components/sidebar'
import { ProgramNavClient } from './program.nav.client'
import { SidebarProgramClient } from '../sidebar.program.client'
import { ThemeToggle } from '@rewardkit/components/toggleTheme'

export const ProgramSidebar = () => {

    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
            <SidebarHeader>
                <SidebarProgramClient />
            </SidebarHeader>
            <SidebarContent className='gap-0'>
                <SidebarGroup className='py-0'>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={(props) => <Link {...props} href={`/w/`} />}>Back</SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <ProgramNavClient />
            </SidebarContent>

            <SidebarFooter>
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}

/*
 * Usage in the program page: put it beside the content instead of the tabs.
 *
 * export const ProgramPage = () => (
 *     <div className='flex gap-6'>
 *         <Suspense fallback={null}>
 *             <ProgramSidebar />
 *         </Suspense>
 *         <Dashboard className='flex-1 max-w-3xl'>
 *             ...header + <ProgramClient />
 *         </Dashboard>
 *     </div>
 * )
 */