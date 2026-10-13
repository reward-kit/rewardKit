"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Image } from "@rewardkit/packages/ui/components/image"
import { useProgram } from "../program/hooks/useProgram"
import { Small } from "@rewardkit/packages/ui/components/typography"

function BootSplash({ onTimeout }: { onTimeout?: () => void }) {
    const [showHelp, setShowHelp] = useState(false)

    // Show a helpful retry / troubleshooting action if it takes longer than 6 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowHelp(true), 6000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative overflow-hidden rounded-xl">
                    <Image src="/svg/rewardkit_emblem.svg" className="w-12" alt="rewardkit" />
                    <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Fallback action if stuck loading */}
            {showHelp && (
                <div className="flex flex-col items-center gap-2 animate-fadeIn">
                    <p className="text-xs text-muted-foreground">Almost there. Its taking longer than expected.</p>
                </div>
            )}
        </div>
    )
}

let hasBooted = false

export function AppBootGate({ children }: { children: ReactNode }) {
    const { isLoaded: authLoaded } = useAuth()
    const { isLoaded: userLoaded } = useUser()
    const { isLoading: programLoading } = useProgram()

    const [forcedBypass, setForcedBypass] = useState(false)

    const ready = (authLoaded && userLoaded && !programLoading) || forcedBypass
    if (ready) hasBooted = true

    // Splash only until the first successful boot or forced bypass
    if (!hasBooted) {
        return <BootSplash onTimeout={() => setForcedBypass(true)} />
    }

    return <>{children}</>
}