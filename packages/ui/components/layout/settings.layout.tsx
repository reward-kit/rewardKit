import React from "react"
import { ExtraSmall, Paragraph } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"
import { Badge } from "@rewardkit/components/reui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon, StarIcon } from "@hugeicons/core-free-icons"

type WithChildren = {
    children: React.ReactNode
    className?: string
}

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"]

/** Tabler icons are regular React components, e.g. IconInfoCircle */
type TablerIcon = React.ComponentType<{ size?: number | string; className?: string }>

export type AnyIcon = HugeIcon | TablerIcon

/** Renders either icon library through one component. */
const AppIcon = ({ icon, size = 14, className }: { icon: AnyIcon; size?: number; className?: string }) => {
    // Hugeicons exports plain arrays; Tabler exports components (function / forwardRef object)
    if (Array.isArray(icon)) {
        return <HugeiconsIcon icon={icon as HugeIcon} size={size} className={className} />
    }
    const TablerComponent = icon as TablerIcon
    return <TablerComponent size={size} className={className} />
}

/** One section: heading + card. Stack several inside a page wrapper (e.g. `flex flex-col gap-8`). */
export const Settings = ({ children, className }: WithChildren) => (
    <section className={cn("flex w-full flex-col gap-4", className)}>{children}</section>
)

/** Heading above the card. */
export const SettingsHeader = ({ children, className }: WithChildren) => (
    <div className={cn("relative flex w-full flex-col gap-1 px-3", className)}>{children}</div>
)

/** Optional button/control aligned to the right of the heading. */
export const SettingsHeaderAction = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute right-1 top-0">{children}</div>
)

export const SettingsTitle = ({ children, className }: WithChildren) => (
    <Paragraph className={cn("font-medium text-sm", className)}>{children}</Paragraph>
)

export const SettingsDescription = ({ children, className }: WithChildren) => (
    <ExtraSmall className={cn("hidden text-muted-foreground", className)}>{children}</ExtraSmall>
)

/** The rounded card. Direct children (SettingsRow) get dividers between them. */
export const SettingsContent = ({ children, className }: WithChildren) => (
    <div
        className={cn(
            "w-full overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border px-2.75",
            className
        )}
    >
        {children}
    </div>
)

export const SettingsFooter = ({ children, className }: WithChildren) => (
    <div className={cn("w-full", className)}>{children}</div>
)

/* -------------------------------------------------------------------------- */
/*  Row building blocks                                                       */
/* -------------------------------------------------------------------------- */

type InfoTooltipProps = {
    children: React.ReactNode
    /** Hugeicons or Tabler icon. Defaults to the info-circle icon. */
    icon?: AnyIcon
    triggerClassName?: string
    /** Classes for the tooltip popup. */
    contentClassName?: string
}

/** Info icon that shows any React node in a tooltip. Reusable outside rows too. */
export const InfoTooltip = ({ children, icon = InformationCircleIcon, triggerClassName, contentClassName }: InfoTooltipProps) => (
    <Tooltip>
        <TooltipTrigger
            render={(props) => (
                <button
                    {...props}
                    type="button"
                    aria-label="More info"
                    className={cn(
                        "inline-flex shrink-0 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        triggerClassName
                    )}
                />
            )}
        >
            <AppIcon icon={icon} />
        </TooltipTrigger>
        <TooltipContent className={cn("max-w-64 text-xs font-normal", contentClassName)}>{children}</TooltipContent>
    </Tooltip>
)

/** Every Badge prop, all optional. `children` is the tag label. */
export type SettingsRowTag = Partial<React.ComponentProps<typeof Badge>>

type SettingsRowHeadingProps = {
    title?: React.ReactNode
    tag?: SettingsRowTag
    tooltip?: React.ReactNode
    tooltipIcon?: AnyIcon
    className?: string
    tooltipTriggerClassName?: string
    tooltipContentClassName?: string
}

/** Title + info tooltip + tag, on one line. Renders nothing if all three are empty. */
export const SettingsRowHeading = ({ title, tag, tooltip, tooltipIcon, className, tooltipContentClassName, tooltipTriggerClassName }: SettingsRowHeadingProps) => {
    if (!title && !tag && !tooltip) return null

    return (
        <div className={cn("flex items-center gap-1.5 text-xsm! font-medium tracking-tight", className)}>
            {title && <div className="min-w-0">{title}</div>}
            {tooltip && <InfoTooltip triggerClassName={tooltipTriggerClassName} contentClassName={tooltipContentClassName} icon={tooltipIcon}>{tooltip}</InfoTooltip>}
            {tag && <Badge size="sm" variant="invert-light" {...tag} />}
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*  SettingsRow                                                               */
/* -------------------------------------------------------------------------- */

type SettingsRowProps = Omit<React.ComponentProps<"div">, "title"> & {
    title?: React.ReactNode
    description?: React.ReactNode
    /** Small label next to the title. Accepts all Badge props. */
    tag?: SettingsRowTag
    /** Any React node, shown in a tooltip from an info icon next to the title. */
    tooltip?: React.ReactNode
    /** Control on the right: select, button, switch... */
    action?: React.ReactNode
    variant?: "default" | "danger"
    clickable?: boolean
    actionClassName?: string
    /** Custom left content. When passed, it replaces title/description/tag/tooltip. */
    children?: React.ReactNode
    tooltipIcon?: AnyIcon

    tooltipTriggerClassName?: string
    tooltipContentClassName?: string
}

export const SettingsRow = ({
    title,
    description,
    tag,
    tooltip,
    tooltipIcon,
    action,
    variant = "default",
    clickable = false,
    className,
    actionClassName,
    tooltipContentClassName,
    tooltipTriggerClassName,
    children,
    ...rest // onClick, id, data-*, aria-* etc. go straight to the root
}: SettingsRowProps) => (
    <div
        className={cn(
            "group flex w-full flex-col items-start justify-start gap-4 py-2.5 sm:flex-row sm:items-center sm:justify-between",
            clickable && "cursor-pointer hover:bg-muted",
            className
        )}
        {...rest}
    >
        {children ?? (
            <div className="flex min-w-0 flex-col gap-1 sm:max-w-sm">
                <SettingsRowHeading
                    title={title}
                    tag={tag}
                    tooltip={tooltip}
                    tooltipIcon={StarIcon}
                    tooltipTriggerClassName={tooltipTriggerClassName}
                    tooltipContentClassName={tooltipContentClassName}
                    className={variant === "danger" ? "text-destructive" : "text-foreground"}
                />
                {description && (
                    <div className="text-xs font-normal text-muted-foreground/80">{description}</div>
                )}
            </div>
        )}
        {action && <div className={cn("flex shrink-0 justify-end", actionClassName)}>{action}</div>}
    </div>
)