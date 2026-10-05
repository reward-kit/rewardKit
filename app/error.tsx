// app/error.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { Button } from "@rewardkit/packages/ui/components/button"
import { ErrorFallback } from "@rewardkit/components/ErrorFallback"

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { reset: resetQueries } = useQueryErrorResetBoundary()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorFallback
            error={error}
            className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
            onRetry={() => {
                resetQueries() // clear failed queries so they refetch
                reset()        // re-render the segment
            }}
            actions={
                <Button variant="outline" render={(props) => <Link {...props} href="/dashboard" />}>
                    Go Home
                </Button>
            }
        />
    )
}