import React, { ReactNode, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { cn } from "cn"
import { Check, Copy } from "lucide-react"

interface AppTooltipProps {
    content: ReactNode
    children: ReactNode
    className?: string
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    /** Force the tooltip open while true. When false or omitted, hover/focus controls it. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

interface AppCopyTooltipProps {
    /** The string value to copy to clipboard */
    copyValue: string
    /** Trigger element (e.g., button, text, or badge) */
    children: ReactNode
    /** Custom label/content to render in tooltip. Defaults to showing copyValue */
    content?: ReactNode
    /** Class applied to the trigger wrapper */
    className?: string
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    /** Timeout in ms before the checkmark reverts back to copy icon */
    copiedTimeout?: number
}

export const AppTooltip = ({
    content,
    children,
    className,
    side = "top",
    align = "center",
    open,
    defaultOpen = false,
    onOpenChange,
}: AppTooltipProps) => {
    const [interactiveOpen, setInteractiveOpen] = React.useState(defaultOpen)

    const asChild = React.isValidElement(children)
    const isOpen = open === true || interactiveOpen

    const handleOpenChange = (next: boolean) => {
        setInteractiveOpen(next)
        onOpenChange?.(next)
    }

    return (
        <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
            {asChild ? (
                <TooltipTrigger
                    className={className}
                    render={children as React.ReactElement}
                />
            ) : (
                <TooltipTrigger className={cn(className)}>{children}</TooltipTrigger>
            )}
            <TooltipContent className="w-fit" side={side} align={align}>
                {content}
            </TooltipContent>
        </Tooltip>
    )
}

export const AppCopyTooltip = ({
    copyValue,
    children,
    content,
    className,
    side = "top",
    align = "center",
    copiedTimeout = 2000,
}: AppCopyTooltipProps) => {
    const [copied, setCopied] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!copyValue) return

        try {
            await navigator.clipboard.writeText(copyValue)
            setCopied(true)
            setTimeout(() => setCopied(false), copiedTimeout)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    const asChild = React.isValidElement(children)

    return (
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger
                render={<span className={cn("inline-flex min-w-0 items-center", className)} />}
            >
                {children}
            </TooltipTrigger>

            <TooltipContent
                side={side}
                align={align}
                className="flex items-center gap-2 py-1 pr-1 whitespace-nowrap text-xs/snug"
            >
                <span className="truncate max-w-50">
                    {content ?? copyValue}
                </span>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:text-neutral-200 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors cursor-pointer"
                    aria-label={copied ? "Copied" : "Copy to clipboard"}
                >
                    {copied ? (
                        <Check className="size-3.5 text-emerald-500" />
                    ) : (
                        <Copy className="size-3.5" />
                    )}
                </button>
            </TooltipContent>
        </Tooltip>
    )
}