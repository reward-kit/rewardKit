"use client"

import { useClerk } from '@clerk/nextjs'
import { getAvatarColor, getInitial } from '@rewardkit/lib/hashColor'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import Link from 'next/link'

export const SidebarUserClient = () => {
    const { signOut, user, organization } = useClerk()

    const handleSignOut = () => {
        void signOut()
    }

    const { background, foreground } = getAvatarColor(user?.fullName)
    const initial = getInitial(user?.fullName)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="block w-full">
                <div className="flex w-full items-center gap-2 text-sidebar-foreground transition-colors p-2 hover:bg-accent/50 rounded-xl">
                    <Avatar className="size-6 shrink-0">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
                        <AvatarFallback
                            className="text-xs tracking-tight font-medium"
                            style={{ backgroundColor: background, color: foreground }}
                        >
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" side="top" sideOffset={8} className="min-w-56">

                <div className="flex flex-col gap-0 text-sm text-start p-2">
                    <span className="text-foreground font-medium tracking-tight">{user?.fullName}</span>
                    <span className="leading-4 text-xs text-muted-foreground font-medium tracking-tight truncate">{user?.emailAddresses[0].emailAddress}</span>
                </div>
                <DropdownMenuItem render={(props) => (<Link {...props} href={`/w/settings`} />)}>
                    Account settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
