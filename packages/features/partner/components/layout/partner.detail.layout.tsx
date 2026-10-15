"use client"

import * as React from "react"
import { cn } from "@rewardkit/lib/utils"
import { H3, Paragraph, Small } from "@rewardkit/packages/ui/components/typography"
import { UserAvatar } from "@rewardkit/packages/ui/components/user-avatar"
import { Badge } from "@rewardkit/components/reui/badge"
import { AppCopyTooltip, AppTooltip } from "@rewardkit/packages/ui/components/tooltip/tooltip"
import { DetailsCard, DetailsCardContent, DetailsCardHeader, DetailsCardTitle, } from "@rewardkit/components/details-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Building02Icon, DashboardSquare02Icon } from "@hugeicons/core-free-icons"
import { type PartnerStatus } from "@rewardkit/packages/types/partner/partner.schema"
import { PartnerStatusBadge } from "@rewardkit/packages/ui/components/status/partner.status"

type WithChildren = {
    children?: React.ReactNode
    className?: string
}

/**
 * Root wrapper: Stacks on small screens (flex-col), 
 * switches to side-by-side (flex-row) from `lg` screens upwards.
 */
export const PartnerDetail = ({ children, className }: WithChildren) => {
    return (
        <div className={cn("flex w-full flex-col items-start justify-between gap-0", className)}>
            {children}
        </div>
    )
}

/**
 * Left Panel / Sidebar: Holds profile metadata card, stats, and quick info cards.
 */
export const PartnerDetailLeftPanel = ({ children, className }: WithChildren) => {
    return (
        <div className={cn("w-full shrink-0 flex justify-between items-center gap-4", className)}>
            {children}
        </div>
    )
}

/**
 * Right Panel: Holds tabs, data tables, feeds, or major main content views.
 */
export const PartnerDetailRightPanel = ({ children, className }: WithChildren) => {
    return (
        <div className={cn("w-full min-w-0 flex-1 flex flex-col gap-4", className)}>
            {children}
        </div>
    )
}

/**
 * Reusable Profile Metadata Card for the Left Panel
 */
export type PartnerProfileHeaderProps = {
    avatarSeed?: string
    firstName?: string
    lastName?: string
    email?: string
    statusHint?: string
    actions?: React.ReactNode
    className?: string
    countryName?: string
    companyName?: string | null
    status?: PartnerStatus
}

export const PartnerDetailProfileCard = ({
    avatarSeed,
    firstName,
    lastName,
    email,
    actions,
    className,
    countryName,
    companyName,
    status,
    statusHint
}: PartnerProfileHeaderProps) => {
    return (
        <div className={cn("flex flex-col w-full min-w-0 items-start gap-1", className)}>
            {/* Right: details, vertically centered against the left column */}
            <div className="flex min-w-0 w-full max-w-7xl mx-auto p-4 py-8 pt-4 flex-1 flex-col justify-center gap-4">
                <div className="flex w-full justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-fit">
                            <div className="relative">
                                <UserAvatar className="border-3 border-card" seed={avatarSeed} firstName={firstName} size="xl" />

                                {status && (
                                    <AppTooltip
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card"
                                        content={statusHint}
                                    >
                                        <PartnerStatusBadge size="sm" status={status} variant="dot" />
                                    </AppTooltip>
                                )}
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <H3 className="truncate text-lg/snug">
                                {firstName} {lastName}
                            </H3>
                            {email && (
                                <AppCopyTooltip copyValue={email}>
                                    <Paragraph className="truncate text-xsm/snug! text-foreground">
                                        {email}
                                    </Paragraph>
                                </AppCopyTooltip>
                            )}


                            {countryName && (
                                <div className="mt-2">
                                    <span className="truncate text-muted-foreground text-xs/snug">{countryName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                    </div>
                </div>



                {actions && (
                    <div className="flex items-center gap-4">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}


export type MetricItem = {
    label: string
    value: string | number
}

export const MetricCard = ({ label, value }: MetricItem) => (
    <div className="w-full flex items-center justify-between bg-transparent shadow-none border-0 min-w-0 gap-2">
        <div>
            <h3 className="text-xs text-muted-foreground font-normal">{label}</h3>
        </div>
        <div className="pt-0">
            <h4 className="truncate text-xs font-medium">{value}</h4>
        </div>
    </div>
)

export type PartnerDetailMetricsCardProps = {
    title?: string
    metrics: MetricItem[]
    className?: string
}

export const PartnerDetailMetricsCard = ({
    title = "Overview",
    metrics,
}: PartnerDetailMetricsCardProps) => {
    return (
        <DetailsCard>
            <DetailsCardHeader>
                {title && (
                    <DetailsCardTitle className="flex items-center gap-1">
                        {title}
                    </DetailsCardTitle>)}
            </DetailsCardHeader>
            <DetailsCardContent className="divide-y-0 grid grid-cols-4 px-3.5 gap-y-4 py-4">
                {metrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-1.25">
                        <Small className="text-xs">{m.label}</Small>
                        <span className="text-xs! font-semibold">{m.value}</span>
                    </div>
                ))}
            </DetailsCardContent>
        </DetailsCard>
    )
}