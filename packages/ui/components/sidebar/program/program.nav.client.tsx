"use client"

import { Tabs, TabsList, TabsTrigger } from '@rewardkit/packages/ui/components/tabs'
import {
    Settings03Icon,
    Gps01Icon,
    UserMultiple03Icon,
    Wallet01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../sidebar'
import { isNavItemActive } from '@rewardkit/lib/nav'
import { cn } from '@rewardkit/lib/utils'
import { usePathname } from 'next/navigation'

type ProgramNavItem = {
    label: string
    href: string
    icon: typeof Settings03Icon
    isNew?: boolean
}

// static, so it's not rebuilt on every render
export const programSidebarNavItems: ProgramNavItem[] = [
    { label: 'General Settings', href: `/w/program/general`, icon: Settings03Icon },
    { label: 'Payout settings', href: `/w/program/payout`, icon: Wallet01Icon },
    { label: 'Tracking & Safeguard', href: `/w/program/tracking-and-safeguard`, icon: Gps01Icon },
    { label: 'Partner Groups', href: `/w/program/partner-groups`, icon: UserMultiple03Icon, isNew: true },
]

/** Vertical nav, shown inside the sidebar on md+ screens. */
export function ProgramNavClient() {
    const pathname = usePathname()

    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {programSidebarNavItems.map((item) => {
                            const isActive = isNavItemActive(pathname, item.href)
                            return (
                                <SidebarMenuItem key={item.href} className='flex flex-col gap-2'>
                                    <SidebarMenuButton isActive={isActive} className='data-active:bg-transparent hover:bg-transparent text-xsm! active:bg-transparent text-muted-foreground [&_svg]:size-4' render={(props: any) => <Link {...props} href={item.href} />}>
                                        <HugeiconsIcon icon={item.icon} size={18} color="currentColor" strokeWidth={2} />
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}

/** Horizontal nav, shown above the content on small screens (the sidebar takes over at md+). */
export function ProgramNavTabs() {
    const pathname = usePathname()
    // the tab whose route matches the current URL; none while on an unknown sub-route
    const activeHref = programSidebarNavItems.find((item) => isNavItemActive(pathname, item.href))?.href ?? ''

    return (
        <Tabs value={activeHref} className='mb-4 min-w-0'>
            <div className='no-scrollbar mx-auto w-fit max-w-full overflow-x-auto'>
                <TabsList className='w-max'>
                    {programSidebarNavItems.map((item) => (
                        <TabsTrigger
                            key={item.href}
                            value={item.href}
                            nativeButton={false}
                            className='shrink-0 gap-1.5 text-xsm! whitespace-nowrap'
                            render={(props: any) => <Link {...props} href={item.href} />}
                        >
                            <HugeiconsIcon icon={item.icon} size={16} color='currentColor' strokeWidth={2} />
                            {item.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
        </Tabs>
    )
}
