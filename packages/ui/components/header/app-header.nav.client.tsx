"use client"

import {
    IconHomeFilled,
    IconUsersGroup,
    IconUserFilled,
    IconSpeakerphone,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavItemActive } from '@rewardkit/lib/nav'
import { partnersHref } from '@rewardkit/packages/features/partner/lib/partner.search-params'
import { cn } from '@rewardkit/lib/utils'

export function HeaderNavClient() {
    const pathname = usePathname()

    const navItems = [
        { label: 'Home', href: `/w`, icon: IconHomeFilled },
        { label: 'Partners', href: `/w/partners`, to: partnersHref(), icon: IconUsersGroup },
        { label: 'Customers', href: `/w/customers`, icon: IconUserFilled },
        { label: 'Program', href: `/w/program/general`, icon: IconSpeakerphone },
    ]

    return (
        <nav className="flex items-center gap-1">
            {navItems.map((item) => {
                const isActive = isNavItemActive(pathname, item.href)
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.to ?? item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            'group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xsm! font-medium transition-all',
                            isActive
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                        )}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}