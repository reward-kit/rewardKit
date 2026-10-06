"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOrganizationList } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@rewardkit/packages/ui/components/avatar"
import {
    IconCheck,
    IconPlus,
    IconSelector,
} from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@rewardkit/packages/ui/components/dropdown-menu"
import { getAvatarColor, getInitial } from "@rewardkit/lib/hashColor"

type OrgSummary = { id: string; name: string; slug: string | null; imageUrl: string }

export function SidebarOrgClient({
    organization,
    memberships,
}: {
    organization: OrgSummary | null
    memberships: OrgSummary[]
}) {
    const router = useRouter()
    const { setActive } = useOrganizationList()
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const handleSwitch = async (orgId: string, slug: string | null) => {
        await setActive?.({ organization: orgId })
        if (slug) router.push(`/w`)
    }

    const { background, foreground } = getAvatarColor(organization?.name)
    const initial = getInitial(organization?.name)

    if (!isHydrated) {
        // Render a placeholder during SSR to avoid hydration mismatch
        return (
            <div className="flex w-full bg-popover border shadow-xs cursor-pointer group-data-[collapsible=icon]:pl-3 items-center gap-2 rounded-lg p-1.5 py-2 text-sidebar-foreground">
                <Avatar className="size-4 shrink-0 rounded-sm">
                    <AvatarFallback
                        className="rounded-sm text-xs font-medium"
                        style={{ backgroundColor: background, color: foreground }}
                    >
                        {initial}
                    </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-left text-sm font-semibold group-data-[collapsible=icon]:hidden">
                    {organization?.name ?? "Select organization"}
                </span>
                <IconSelector
                    size={14}
                    className="shrink-0 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
                />
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="block cursor-pointer w-full">
                <div className="flex w-full bg-popover border border-border-1 h-9.5 shadow-xs group-data-[collapsible=icon]:pl-3 items-center gap-2 rounded-lg p-1.5 py-2 transition-colors hover:bg-sidebar-accent text-sidebar-accent-foreground">
                    <Avatar className="size-4 shrink-0 rounded-sm">
                        {organization?.imageUrl && (
                            <AvatarImage
                                src={organization.imageUrl}
                                alt={organization.name}
                                className="rounded-sm"
                            />
                        )}
                        <AvatarFallback
                            className="rounded-sm text-xs font-medium"
                            style={{ backgroundColor: background, color: foreground }}
                        >
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-left text-sm font-semibold group-data-[collapsible=icon]:hidden">
                        {organization?.name ?? "Select organization"}
                    </span>
                    <IconSelector
                        size={14}
                        className="shrink-0 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={8} className="min-w-78">
                {memberships.map((m) => {
                    const memberColor = getAvatarColor(m.name)
                    return (
                        <DropdownMenuItem
                            key={m.id}
                            onClick={() => handleSwitch(m.id, m.slug)}
                            className="flex items-center justify-between"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Avatar className="size-6 shrink-0 rounded-lg">
                                    {m.imageUrl && (
                                        <AvatarImage src={m.imageUrl} alt={m.name} className="rounded-lg" />
                                    )}
                                    <AvatarFallback
                                        className="rounded-lg text-xs font-medium"
                                        style={{ backgroundColor: memberColor.background, color: memberColor.foreground }}
                                    >
                                        {getInitial(m.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate font-semibold">{m.name}</span>
                            </div>
                            {m.id === organization?.id && <IconCheck size={14} className="shrink-0" />}
                        </DropdownMenuItem>
                    )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    render={(props) => (
                        <Link {...props} href="/onboarding/program">
                            <IconPlus size={18} stroke={1.2} className="bg-white border p-0.5" />
                            Create new program
                        </Link>
                    )}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}