"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@rewardkit/packages/ui/components/button"
import { cn } from "@rewardkit/lib/utils"
import { Skeleton } from "./skeleton"

type CopyableIdProps = {
    value: string
    className?: string
    /** Accessible label for the copy button */
    label?: string
    isLoading?: boolean
}

export const CopyableId = ({ value, className, label = "Copy ID", isLoading = false }: CopyableIdProps) => {
    const [copied, setCopied] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard API can fail on insecure origins or when permission is denied
            setCopied(false)
        }
    }

    return (
        <div
            className={cn(
                "inline-flex justify-end w-full items-center gap-1",
                className
            )}
        >
            {isLoading && <Skeleton className="max-w-60 min-w-60 w-full h-4.5 rounded-md bg-muted px-2 py-1" />}
            {!isLoading && <code className="max-w-60 truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground" title={value}>
                {value}
            </code>}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                onClick={handleCopy}
                aria-label={copied ? "Copied" : label}
            >
                <HugeiconsIcon
                    icon={copied ? Tick02Icon : Copy01Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={1.85}
                />
            </Button>
        </div>
    )
}