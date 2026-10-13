import React from "react"
import { ExtraSmall, Paragraph } from "@rewardkit/packages/ui/components/typography"
import { cn } from "@rewardkit/lib/utils"
import { IconPencil } from "@tabler/icons-react"
import { Button } from "@rewardkit/packages/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"

type WithChildren = {
    children: React.ReactNode
    className?: string
}

/** One section: heading + card. Stack several inside a page wrapper (e.g. `flex flex-col gap-8`). */
export const DetailsCard = ({ children, className }: WithChildren) => (
    <section className={cn("flex w-full border rounded-xl flex-col", className)}>{children}</section>
)

/** Heading above the card. */
export const DetailsCardHeader = ({ children, className }: WithChildren) => (
    <div className={cn("relative flex w-full flex-col gap-1 border-b px-3.5 py-3", className)}>{children}</div>
)

/** Optional button/control aligned to the right of the heading. */
export const DetailsCardHeaderAction = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute right-1 top-0">{children}</div>
)

export const DetailsCardTitle = ({ children, className }: WithChildren) => (
    <Paragraph className={cn("font-normal text-xs!", className)}>{children}</Paragraph>
)

export const DetailsCardDescription = ({ children, className }: WithChildren) => (
    <ExtraSmall className={cn("hidden text-muted-foreground", className)}>{children}</ExtraSmall>
)

/** The rounded card. Direct children (DetailsRow) get dividers between them. */
export const DetailsCardContent = ({ children, className }: WithChildren) => (
    <div
        className={cn(
            "w-full overflow-hidden divide-y divide-input/4",
            className
        )}
    >
        {children}
    </div>
)

export const DetailsCardFooter = ({ children, className }: WithChildren) => (
    <div className={cn("w-full", className)}>{children}</div>
)

/* -------------------------------------------------------------------------- */
/*  DetailsRow                                                                */
/* -------------------------------------------------------------------------- */

type DetailsRowProps = Omit<React.ComponentProps<"div">, "title"> & {
    title?: React.ReactNode
    description?: React.ReactNode
    /** Plain value shown on the right. */
    value?: React.ReactNode
    /** Shows the pencil icon after the value. */
    showEditIcon?: boolean
    /** Called when the pencil icon is clicked. */
    onActionClick?: () => void
    /** Extra control on the far right: button, switch... */
    action?: React.ReactNode
    variant?: "default" | "danger"
    clickable?: boolean
    actionClassName?: string
    /** Custom right content. When passed, it replaces `value`. */
    children?: React.ReactNode
}

export const DetailsRow = ({
    title,
    description,
    value,
    showEditIcon = false,
    onActionClick,
    action,
    variant = "default",
    clickable = false,
    className,
    actionClassName,
    children,
    ...rest
}: DetailsRowProps) => {
    const content = children ?? value
    const hasValue = content !== undefined && content !== null && content !== ""

    return (
        <div
            className={cn(
                "group flex w-full items-start justify-between gap-4 py-3.75 px-3.5 mt-0",
                clickable && "cursor-pointer hover:bg-muted",
                className
            )}
            {...rest}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {title && (
                    <div className={cn("min-w-0 text-xsm!", variant === "danger" ? "text-destructive" : "text-muted-foreground")}>
                        {title}
                    </div>
                )}
                {description && <div className="text-xs font-normal text-muted-foreground/80">{description}</div>}

                {hasValue && (
                    <div className={cn("min-w-0 text-xsm text-foreground break-words", (title || description) && "mt-1.5")}>
                        {content}
                    </div>
                )}
            </div>

            {(showEditIcon || action) && (
                <div className={cn("flex shrink-0 items-center justify-end gap-2", actionClassName)}>
                    {showEditIcon && (
                        <Button
                            type="button"
                            aria-label="Edit"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onActionClick?.()
                            }}
                            className="h-auto min-w-auto rounded-sm p-1"
                        >
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        </Button>
                    )}
                    {action}
                </div>
            )}
        </div>
    )
}