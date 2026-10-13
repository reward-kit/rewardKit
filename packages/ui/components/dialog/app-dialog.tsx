// components/app-dialog.tsx
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../dialog";
import { cn } from "@rewardkit/lib/utils";
import { Button } from "../button";

type DialogRootProps = React.ComponentProps<typeof Dialog>;
type DialogContentProps = React.ComponentProps<typeof DialogContent>;

export interface AppDialogProps extends DialogRootProps {
    /** Element that opens the dialog (rendered with asChild) */
    trigger?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    /** Rendered inside DialogFooter */
    footer?: React.ReactNode;
    /** Any DialogContent prop (className, onInteractOutside, onEscapeKeyDown, ...) */
    contentProps?: DialogContentProps;
    headerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    footerClassName?: string;
}

export function AppDialog({
    trigger,
    title,
    description,
    footer,
    children,
    contentProps,
    headerClassName,
    titleClassName,
    descriptionClassName,
    footerClassName,
    ...rootProps // open, onOpenChange, defaultOpen, modal
}: AppDialogProps) {
    const { className: contentClassName, ...restContentProps } = contentProps ?? {};

    return (
        <Dialog {...rootProps}>
            {trigger && <DialogTrigger>{trigger}</DialogTrigger>}

            <DialogContent className={cn(contentClassName)} {...restContentProps}>
                {(title || description) && (
                    <DialogHeader className={headerClassName}>
                        {/* Radix warns if DialogTitle is missing, so always render one */}
                        <DialogTitle className={cn(!title && "sr-only", titleClassName)}>
                            {title ?? "Dialog"}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className={descriptionClassName}>
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}

                {children}

                {footer &&
                    <DialogFooter className={footerClassName}>
                        <DialogClose render={<Button type="button" size="sm" variant="outline" />}>Close</DialogClose>
                        {footer}
                    </DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

// Re-exports so you can still compose manually from the same import
export {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
};