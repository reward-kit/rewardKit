"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"

export function SidebarProgramClient() {
    const router = useRouter()
    const { program, programs } = useProgram()


    const { background, foreground } = getAvatarColor(program?.name)
    const initial = getInitial(program?.name)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="block cursor-pointer w-full">
                <div className="flex w-full bg-popover border border-border-1 h-9.5 shadow-xs group-data-[collapsible=icon]:pl-3 items-center gap-2 rounded-lg p-1.5 py-2 transition-colors hover:bg-sidebar-accent text-sidebar-accent-foreground">
                    <Avatar className="size-4 shrink-0 rounded-sm">
                        {program?.faviconUrl && (
                            <AvatarImage
                                src={program?.faviconUrl}
                                alt={program.name}
                                className="rounded-sm"
                            />
                        )}
                        <AvatarFallback
                            className="rounded-sm text-[10px]/snug font-medium"
                            style={{ backgroundColor: background, color: foreground }}
                        >
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-left text-sm font-semibold group-data-[collapsible=icon]:hidden">
                        {program?.name ?? "Select program"}
                    </span>
                    <IconSelector
                        size={14}
                        className="shrink-0 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={8} className="min-w-78">
                {programs?.data?.programs.map((m) => {
                    const memberColor = getAvatarColor(m.name)
                    return (
                        <DropdownMenuItem
                            key={m.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Avatar className="size-6 shrink-0 rounded-lg">
                                    {m.faviconUrl && (
                                        <AvatarImage src={m.faviconUrl} alt={m.name} className="rounded-lg" />
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
                            {m.id === program?.id && <IconCheck size={14} className="shrink-0" />}
                        </DropdownMenuItem>
                    )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    render={(props) => (
                        <Link {...props} href="/onboarding">
                            <IconPlus size={18} stroke={1.2} className="bg-white border p-0.5" />
                            Create new program
                        </Link>
                    )}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}