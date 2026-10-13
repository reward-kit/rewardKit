"use client"

import {
    Sidebar,
    SidebarContent,
} from '@rewardkit/packages/ui/components/sidebar'
import { ProgramNavClient } from './program.nav.client'

export const ProgramSidebar = () => {

    return (
        <Sidebar className="absolute! top-0 bottom-0 h-full! border-r-0! bg-transparent px-0">
            <SidebarContent className='gap-0 mt-4'>
                <ProgramNavClient />
            </SidebarContent>
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