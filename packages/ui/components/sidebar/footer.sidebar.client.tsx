"use client"

import { useClerk } from '@clerk/nextjs'
import { getAvatarColor, getInitial } from '@rewardkit/lib/hashColor'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import Link from 'next/link'

export const FooterSidebarClient = () => {
    const { signOut, user } = useClerk()

    const handleSignOut = () => {
        void signOut()
    }

    const { background, foreground } = getAvatarColor(user?.fullName)
    const initial = getInitial(user?.fullName)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="block w-full pt-2 border-t">
                <div className="flex w-full items-center gap-2 text-sidebar-foreground transition-colors p-2 hover:bg-accent/50 rounded-xl">
                    <Avatar className="size-8 shrink-0">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
                        <AvatarFallback
                            className="text-xs font-medium"
                            style={{ backgroundColor: background, color: foreground }}
                        >
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0 text-sm text-start">
                        <span className="text-foreground">{user?.fullName}</span>
                        <span className="leading-4 text-xs truncate">{user?.emailAddresses[0].emailAddress}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" side="top" sideOffset={8} className="min-w-56">
                <div className="flex flex-col px-2.5 py-1.5">
                    <span className="truncate text-sm font-medium">{user?.fullName}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.emailAddresses[0].emailAddress}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    render={(props) => (
                        <Link {...props} href="/w/_/settings">
                            Account settings
                        </Link>
                    )}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
