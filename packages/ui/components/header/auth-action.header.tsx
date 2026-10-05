"use client"

import Link from "next/link"
import { useAuth, useClerk } from "@clerk/nextjs"
import { Button } from "../button"
import { Image } from "../image"

export const HeaderAuthActions = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useClerk();

    if (isLoaded && isSignedIn) {
        return (
            <Button variant={"secondary"} nativeButton={false} render={<Link href="/w" />}>
                {user?.imageUrl && <Image className="size-5 rounded-full" src={user?.imageUrl} alt={`${user?.fullName}`} />}
                Dashboard
            </Button>
        )
    }

    return (
        <>
            <Link href="/sign-in">Login</Link>
            <Button nativeButton={false} render={<Link href="/sign-up" />}>
                Start your free trial
            </Button>
        </>
    )
}