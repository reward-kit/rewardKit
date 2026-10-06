"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@rewardkit/packages/ui/components/button"
import { cn } from "@rewardkit/lib/utils"
import { Skeleton } from "./skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

type CopyableIdProps = {
    value: string
    className?: string
    /** Accessible label for the copy button */
    label?: string
    isLoading?: boolean
    showCopyButton?: boolean
}

export const CopyableId = ({ value, className, label = "Copy ID", isLoading = false, showCopyButton = false }: CopyableIdProps) => {
    const [copied, setCopied] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleCopy = async (e: React.MouseEvent) => {
        // Prevent trigger from double firing if clicking button inside trigger
        e.stopPropagation()
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
            onClick={(e) => !showCopyButton && handleCopy(e)}
            className={cn(
                "inline-flex justify-end w-fit items-center gap-1",
                className
            )}
        >
            {isLoading && <Skeleton className="max-w-60 min-w-60 w-full h-4.5 rounded-md bg-muted px-2 py-1" />}
            {!isLoading && (
                <Tooltip open={!showCopyButton && copied}>
                    <TooltipTrigger>
                        <code
                            className={cn(
                                "max-w-60 w-fit truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground",
                                !showCopyButton && "cursor-pointer",
                            )}
                            title={value}
                        >
                            {value}
                        </code>
                    </TooltipTrigger>

                    <TooltipContent>Copied</TooltipContent>
                </Tooltip>
            )}
            {
                showCopyButton &&
                <Tooltip open={copied}>
                    <TooltipTrigger render={(props) => <Button
                        {...props}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0"
                        onClick={handleCopy}
                        aria-label={copied ? "Copied" : label}
                    />}>
                        <HugeiconsIcon
                            icon={copied ? Tick02Icon : Copy01Icon}
                            size={14}
                            color="currentColor"
                            strokeWidth={1.85}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        Copied
                    </TooltipContent>
                </Tooltip>
            }
        </div >
    )
}