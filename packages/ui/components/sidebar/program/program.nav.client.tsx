"use client"

import {
    Settings03Icon,
    Gps01Icon,
    UserMultiple03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../sidebar'
import { isNavItemActive } from '@rewardkit/lib/nav'
import { usePathname } from 'next/navigation'
import { Badge } from '@rewardkit/components/reui/badge'

type ProgramNavItem = {
    label: string
    href: string
    icon: typeof Settings03Icon
    isNew?: boolean
}

// static, so it's not rebuilt on every render
const programSidebarNavItems: ProgramNavItem[] = [
    { label: 'General Settings', href: `/w/program/general`, icon: Settings03Icon },
    { label: 'Tracking & Safeguard', href: `/w/program/tracking-and-safeguard`, icon: Gps01Icon },
    { label: 'Partner Groups', href: `/w/program/partner-groups`, icon: UserMultiple03Icon, isNew: true },
]

export function ProgramNavClient() {
    const pathname = usePathname()

    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarGroupLabel>Program</SidebarGroupLabel>
                    <SidebarMenu>
                        {programSidebarNavItems.map((item) => {
                            const isActive = isNavItemActive(pathname, item.href)
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton isActive={isActive} render={(props: any) => <Link {...props} href={item.href} />}>
                                        <HugeiconsIcon icon={item.icon} size={18} color="currentColor" strokeWidth={1.85} />
                                        {item.label}
                                        {item.isNew && (
                                            <Badge shine variant="success-light" className="ml-auto text-xs font-medium leading-none">
                                                New
                                            </Badge>
                                        )}
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