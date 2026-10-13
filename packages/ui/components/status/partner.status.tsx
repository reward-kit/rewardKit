import React from "react"
import { Badge } from "@rewardkit/components/reui/badge"
import { cn } from "@rewardkit/lib/utils"
import { PARTNER_STATUS_STYLE } from "@rewardkit/packages/features/partner/contants/status"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"

type PartnerStatusValue = keyof typeof PARTNER_STATUS_STYLE
type PartnerStatusSize = "sm" | "default" | "lg"

type PartnerStatusProps = Omit<React.ComponentProps<typeof Badge>, "variant" | "size"> & {
    /** Falls back to pending when empty. */
    status?: PartnerStatusValue | null
    /** "default" is a badge, "dot" is a colored dot + text. */
    variant?: "default" | "dot"
    size?: PartnerStatusSize
}

// Only used by the dot variant. The default variant passes size to Badge.
const DOT_SIZE: Record<PartnerStatusSize, { dot: string; text: string; gap: string }> = {
    sm: { dot: "size-1.5", text: "text-xxs!", gap: "gap-1.25" },
    default: { dot: "size-2", text: "text-xs", gap: "gap-1.5" },
    lg: { dot: "size-2.5", text: "text-sm", gap: "gap-2" },
}

export const PartnerStatusBadge = ({
    status,
    variant = "default",
    size = "sm",
    className,
    ...rest
}: PartnerStatusProps) => {
    const style = PARTNER_STATUS_STYLE[status ?? PARTNER_STATUS.PENDING]

    if (!style) return null

    if (variant === "dot") {
        const s = DOT_SIZE[size]
        return (
            <Badge
                {...rest}
                variant="outline"
                size={size}
                className={cn("whitespace-nowrap bg-background font-normal", s.gap, className)}
            >
                <span className={cn("rounded-full", s.dot, style.dot)} />
                <span className={s.text}>{style.label}</span>
            </Badge>
        )
    }

    return (
        <Badge {...rest} size={size} className={cn(style.className, className)}>
            {style.label}
        </Badge>
    )
}