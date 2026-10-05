import React from "react"
import { ExtraSmall, Paragraph, Small } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"

type WithChildren = {
    children: React.ReactNode
    className?: string
}

/** One section: heading + card. Stack several inside a page wrapper (e.g. `flex flex-col gap-8`). */
export const Settings = ({ children, className }: WithChildren) => {
    return <section className={cn("flex w-full flex-col gap-4", className)}>{children}</section>
}

/** Heading above the card. */
export const SettingsHeader = ({ children, className }: WithChildren) => {
    return <div className={cn("relative flex w-full flex-col gap-1", className)}>{children}</div>
}

/** Optional button/control aligned to the right of the heading. */
export const SettingsHeaderAction = ({ children }: { children: React.ReactNode }) => {
    return <div className="absolute right-1 top-0">{children}</div>
}

export const SettingsTitle = ({ children, className }: WithChildren) => {
    return <Paragraph className={cn("font-medium", className)}>{children}</Paragraph>
}

export const SettingsDescription = ({ children, className }: WithChildren) => {
    return <ExtraSmall className={cn("text-muted-foreground", className)}>{children}</ExtraSmall>
}

/** The rounded card. Direct children (SettingsRow) get dividers between them. */
export const SettingsContent = ({ children, className }: WithChildren) => {
    return (
        <div
            className={cn(
                "w-full overflow-hidden rounded-lg border bg-card divide-y divide-border/80",
                className
            )}
        >
            {children}
        </div>
    )
}

export const SettingsFooter = ({ children, className }: WithChildren) => {
    return (
        <div
            className={cn(
                "w-full",
                className
            )}
        >
            {children}
        </div>
    )
}

type SettingsRowProps = {
    title?: React.ReactNode
    description?: React.ReactNode
    /** Control on the right: select, badge, button, switch... */
    action?: React.ReactNode
    variant?: "default" | "danger"
    className?: string
    value?: string | number | null
    /** Custom row content. When passed, it replaces title/description. */
    children?: React.ReactNode
    clickable?: boolean
    actionClassName?: string
}

export const SettingsRow = ({
    title,
    description,
    action,
    variant = "default",
    className,
    children,
    clickable = false,
    actionClassName,
}: SettingsRowProps) => {
    return (
        <div className={cn("grid grid-cols-2 mx-1 w-[calc(100%-8px)] group sm:items-center justify-between gap-4 px-3 py-2.75", clickable && "cursor-pointer hover:bg-muted", className)}>
            {children ?? (
                <div className="flex min-w-0 flex-col gap-1">
                    {title && (
                        <Paragraph className={cn("text-xsm! text-foreground", variant === "danger" && "text-destructive")}>
                            {title}
                        </Paragraph>
                    )}
                    {description && <SettingsDescription className="text-xs! text-muted-foreground/80 font-normal">{description}</SettingsDescription>}
                </div>
            )}
            {action && <div className={cn("shrink-0 col-span-1", actionClassName)}>{action}</div>}
        </div>
    )
}