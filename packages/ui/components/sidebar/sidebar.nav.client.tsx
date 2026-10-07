"use client"

import {
    Home03Icon,
    UserMultiple03Icon,
    HandshakeIcon,
    Megaphone01Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../sidebar'
import { isNavItemActive } from '@rewardkit/lib/nav'
import { usePathname } from 'next/navigation'

export function SidebarNavClient() {
    const pathname = usePathname()

    const appSidebarNavItems = [
        { label: 'Home', href: `/w`, icon: Home03Icon },
        { label: 'Partners', href: `/w/partners`, icon: HandshakeIcon },
        { label: 'Customers', href: `/w/customers`, icon: UserMultiple03Icon },
    ]

    const settingsNavItems = [
        { label: 'Program', href: `/w/program/general`, icon: Megaphone01Icon },
    ]
    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {appSidebarNavItems.map((item) => {
                            const isActive = isNavItemActive(pathname, item.href)
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton isActive={isActive} render={(props) => <Link {...props} href={item.href} />}>
                                        <HugeiconsIcon icon={item.icon} size={18} color="currentColor" strokeWidth={1.85} />
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Configure</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {settingsNavItems.map((item) => {
                            const isActive = isNavItemActive(pathname, item.href)
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton isActive={isActive} render={(props) => <Link {...props} href={item.href} />}>
                                        <HugeiconsIcon icon={item.icon} size={18} color="currentColor" strokeWidth={1.85} />
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