import React from "react"
import { Button } from "@rewardkit/packages/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@rewardkit/packages/ui/components/dialog"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@rewardkit/packages/ui/components/sheet"
import { cn } from "@rewardkit/lib/utils"

export interface FormModalProps {
    /** Same form, different container. "card" = settings-card style dialog. */
    mode?: "dialog" | "sheet" | "card"
    open: boolean
    onOpenChange: (open: boolean) => void
    title: React.ReactNode
    description?: React.ReactNode
    /** Small muted text on the left of the footer (card mode only), e.g. "Maximum of 30 characters". */
    footerHint?: React.ReactNode
    /** The `id` of the <form> inside children. The footer submit button targets it. */
    formId: string
    submitLabel?: string
    cancelLabel?: string
    /** Defaults to true for dialog/sheet, false for card. */
    showCancel?: boolean
    /** Mutation pending state, owned by the caller. */
    isPending?: boolean
    className?: string
    /** The form component. */
    children: React.ReactNode

    submitDisabled?: boolean
}

export const FormModal = ({
    mode = "dialog",
    open,
    onOpenChange,
    title,
    description,
    footerHint,
    formId,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    showCancel,
    isPending = false,
    className,
    children,
    submitDisabled = false,
}: FormModalProps) => {
    const isCard = mode === "card"
    const withCancel = showCancel ?? !isCard

    const footerButtons = (
        <>
            {withCancel && (
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(isCard && "rounded-full")}
                    disabled={isPending}
                    onClick={() => onOpenChange(false)}
                >
                    {cancelLabel}
                </Button>
            )}
            {/* lives outside the <form>, so it points at it with form={formId} */}
            <Button
                type="submit"
                size="sm"
                form={formId}
                className={cn(isCard && "rounded-full")}
                isLoading={isPending}
                disabled={isPending || submitDisabled}
            >
                {submitLabel}
            </Button>
        </>
    )

    if (mode === "sheet") {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className={className}>
                    <SheetHeader>
                        <SheetTitle>{title}</SheetTitle>
                        {description && <SheetDescription>{description}</SheetDescription>}
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4">{children}</div>
                    <SheetFooter>{footerButtons}</SheetFooter>
                </SheetContent>
            </Sheet>
        )
    }

    if (isCard) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className={cn("gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md", className)}
                >
                    <DialogHeader className="gap-1 px-5 pt-5 text-left">
                        <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                        {description && (
                            <DialogDescription className="text-sm text-muted-foreground">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="px-5 py-4">{children}</div>

                    <DialogFooter className="flex-row items-center justify-between gap-3 border-t px-5 py-3 sm:justify-between">
                        <p className="text-xs text-muted-foreground">{footerHint}</p>
                        <div className="flex items-center gap-2">{footerButtons}</div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-md", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="py-2 space-y-4">{children}</div>
                <DialogFooter>{footerButtons}</DialogFooter>
            </DialogContent>
        </Dialog>
    )
}