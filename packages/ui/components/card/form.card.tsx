import React from "react"
import { Button } from "@rewardkit/packages/ui/components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@rewardkit/packages/ui/components/card"
import { cn } from "@rewardkit/lib/utils"

export interface FormCardProps {
    title: React.ReactNode
    description?: React.ReactNode
    /** Small muted text on the left of the footer, e.g. "Maximum of 30 characters". */
    footerHint?: React.ReactNode
    /** The `id` of the <form> inside children. The footer submit button targets it. */
    formId: string
    submitLabel?: string
    /** Mutation pending state, owned by the caller. */
    isPending?: boolean
    /** Disables Save, e.g. while the value is unchanged. */
    submitDisabled?: boolean
    className?: string
    /** The form component. */
    children: React.ReactNode
}

export const FormCard = ({
    title,
    description,
    footerHint,
    formId,
    submitLabel = "Save",
    isPending = false,
    submitDisabled = false,
    className,
    children,
}: FormCardProps) => (
    <Card className={cn("flex h-full w-full flex-col bg-popover gap-0 overflow-hidden rounded-2xl py-0", className)}>
        <CardHeader className="gap-1 px-5 pt-5">
            <CardTitle className="text-sm! font-medium">{title}</CardTitle>
            {description && (
                <CardDescription className="text-xs!">{description}</CardDescription>
            )}
        </CardHeader>

        {/* flex-1 pushes the footer to the bottom of the card */}
        <CardContent className="flex-1 px-5 py-4">{children}</CardContent>

        <CardFooter className="mt-auto min-h-14 items-center bg-popover justify-between gap-3 border-t px-5 py-3 border-input [.border-t]:pt-3">
            <p className="min-w-0 text-xxs! text-muted-foreground">{footerHint}</p>
            {/* lives outside the <form>, so it points at it with form={formId} */}
            <Button
                type="submit"
                size="sm"
                form={formId}
                className="shrink-0 rounded-full"
                isLoading={isPending}
                disabled={isPending || submitDisabled}
            >
                {submitLabel}
            </Button>
        </CardFooter>
    </Card>
)