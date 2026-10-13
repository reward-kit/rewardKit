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
    /** Same form, different container. */
    mode?: "dialog" | "sheet"
    open: boolean
    onOpenChange: (open: boolean) => void
    title: React.ReactNode
    description?: React.ReactNode
    /** The `id` of the <form> inside children. The footer submit button targets it. */
    formId: string
    submitLabel?: string
    cancelLabel?: string
    /** Mutation pending state, owned by the caller. */
    isPending?: boolean
    className?: string
    /** The form component. */
    children: React.ReactNode
}

export const FormModal = ({
    mode = "dialog",
    open,
    onOpenChange,
    title,
    description,
    formId,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    isPending = false,
    className,
    children,
}: FormModalProps) => {
    const footerButtons = (
        <>
            <Button type="button" size={"sm"} variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
                {cancelLabel}
            </Button>
            {/* lives outside the <form>, so it points at it with form={formId} */}
            <Button type="submit" size={"sm"} form={formId} isLoading={isPending} disabled={isPending}>
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-md", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="py-2 space-y-4">
                    {children}
                </div>
                <DialogFooter>{footerButtons}</DialogFooter>
            </DialogContent>
        </Dialog>
    )
}