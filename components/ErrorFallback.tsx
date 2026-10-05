// components/ErrorFallback.tsx
"use client"

import { Button } from "@rewardkit/packages/ui/components/button"
import { H2, Paragraph } from "@rewardkit/packages/ui/components/typography"
import { SUPPORT } from "@rewardkit/packages/config/support"
import { TRPCClientError } from "@trpc/client"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
    Activity01Icon,
    Alert02Icon,
    FileNotFoundIcon,
    LockIcon,
    NewTwitterIcon,
    Linkedin01Icon,
    GithubIcon,
} from "@hugeicons/core-free-icons"

type Props = {
    error: unknown
    onRetry?: () => void
    compact?: boolean
    actions?: React.ReactNode
    className?: string
}

const VIEWS: Record<string, { icon: IconSvgElement; title: string }> = {
    NOT_FOUND: { icon: FileNotFoundIcon, title: "Not found" },
    FORBIDDEN: { icon: LockIcon, title: "Access denied" },
}

const DEFAULT_VIEW = { icon: Alert02Icon, title: "Something went wrong" }

const SOCIAL_ICONS: Record<string, IconSvgElement> = {
    "X (Twitter)": NewTwitterIcon,
    LinkedIn: Linkedin01Icon,
    GitHub: GithubIcon,
}

export function ErrorFallback({ error, onRetry, compact, actions, className }: Props) {
    const data = error instanceof TRPCClientError ? error.data : undefined
    const code = data?.code as string | undefined
    const httpStatus = data?.httpStatus as number | undefined

    const digest = (error as { digest?: string } | undefined)?.digest
    const reference = (data?.requestId as string | undefined) ?? digest

    const { icon, title } = (code && VIEWS[code]) || DEFAULT_VIEW

    const isServerError = (httpStatus ?? 500) >= 500
    const message =
        !isServerError && error instanceof Error ? error.message : "Please try again."

    if (compact) {
        return (
            <Button onClick={onRetry} variant="outline">
                <HugeiconsIcon icon={icon} className="size-4" />
                {title}
            </Button>
        )
    }

    const mailto =
        `mailto:${SUPPORT.email}` +
        `?subject=${encodeURIComponent("Error report")}` +
        (reference ? `&body=${encodeURIComponent(`Reference: ${reference}\n\nWhat I was doing:\n`)}` : "")

    return (
        <div className={className ?? "flex h-full flex-col items-center justify-center gap-3 p-8 text-center"}>
            <HugeiconsIcon icon={icon} className="size-10" />
            <div className="space-y-2">
                <H2>{title}</H2>
                <Paragraph className="text-muted-foreground">{message}</Paragraph>

                {isServerError && (
                    <>
                        <Paragraph className="text-sm text-muted-foreground">
                            If this keeps happening, please{" "}
                            <a href={mailto} className="underline underline-offset-4">
                                contact support
                            </a>
                            {reference ? " and include the reference below." : "."}
                        </Paragraph>
                        {reference && (
                            <Paragraph className="mt-4 text-xs text-muted-foreground">
                                Reference: {reference}
                            </Paragraph>
                        )}
                    </>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                {onRetry && (
                    <Button variant="outline" onClick={onRetry}>
                        Try again
                    </Button>
                )}
                {actions}
            </div>

            {isServerError && (
                <div className="mt-8 flex flex-col items-center gap-3 border-t pt-6">
                    <a
                        href={SUPPORT.statusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <HugeiconsIcon icon={Activity01Icon} className="size-4" />
                        Check uptime and incidents
                    </a>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-muted-foreground">Follow for updates</span>
                        <div className="flex gap-4">
                            {SUPPORT.socials.map(({ label, href }) => {
                                const socialIcon = SOCIAL_ICONS[label]
                                return (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {socialIcon && <HugeiconsIcon icon={socialIcon} className="size-4" />}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}