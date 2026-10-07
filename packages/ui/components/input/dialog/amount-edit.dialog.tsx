"use client"

import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { PrefixTextInput } from '@rewardkit/packages/ui/components/input/prefix.text.input'
import { formatMinorAmount } from '@rewardkit/lib/amount/formatMinorAmount'
import { cn } from '@rewardkit/lib/utils'
import currencyMap from "currency-symbol-map";

type EditAmountDialogProps = {
    title: string
    description?: string
    label: string
    /** Amount in minor units (cents). */
    value?: number | null
    /** Receives minor units. Return a falsy value (or throw) to keep the dialog open. */
    onSave: (minorUnits: number) => Promise<unknown> | unknown
    isSaving?: boolean
    saveLabel?: string
    cancelLabel?: string
    /** Disallow zero, which is what an empty input reports. Defaults to true. */
    requirePositive?: boolean
    /** What the trigger displays next to the pencil icon. Defaults to the formatted amount. */
    children?: ReactNode
    triggerClassName?: string
    contentClassName?: string
    inputProps?: Omit<ComponentProps<typeof PrefixTextInput>, 'label' | 'value' | 'onChange'>
}

export const EditAmountDialog = ({
    title,
    description,
    label,
    value,
    onSave,
    isSaving = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    requirePositive = true,
    children,
    triggerClassName,
    contentClassName,
    inputProps,
}: EditAmountDialogProps) => {
    const closeRef = useRef<HTMLButtonElement>(null)
    const [draft, setDraft] = useState<number>(value ?? 0)

    const isDirty = draft !== (value ?? 0) && (!requirePositive || draft > 0)

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isDirty) return
        const saved = await onSave(draft)
        if (saved) closeRef.current?.click() // close only on success
    }

    return (
        <Dialog onOpenChange={() => setDraft(value ?? 0)}> {/* reset the draft on every open/close */}
            <DialogTrigger
                nativeButton={false}
                render={(props) => (
                    <div
                        {...props}
                        className={cn(
                            'text-xsm flex font-medium justify-end tracking-tight items-center gap-2 outline-none focus-visible:outline-none focus-visible:ring-0',
                            triggerClassName
                        )}
                    >

                        <div className='flex items-center gap-0.5'>
                            <span>{currencyMap(inputProps?.prefix ?? "USD")}</span>
                            <span>{children ?? (value != null ? formatMinorAmount(value) : '-')}</span>
                        </div>
                        <Button
                            variant="ghost"
                            className="min-w-fit px-0 py-0 rounded-sm text-muted-foreground size-6"
                        >
                            <HugeiconsIcon icon={PencilLineIcon} size={12} />
                        </Button>
                    </div>
                )}
            />
            <DialogContent className={cn('min-w-md', contentClassName)}>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <div className="p-6 pt-0 flex flex-col gap-4">
                        <PrefixTextInput
                            autoComplete="off"
                            {...inputProps}
                            label={label}
                            value={draft}
                            onChange={setDraft}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose ref={closeRef} render={<Button type="button" size="sm" variant="ghost" />}>
                            {cancelLabel}
                        </DialogClose>
                        <Button type="submit" size="sm" isLoading={isSaving} disabled={!isDirty}>
                            {saveLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}