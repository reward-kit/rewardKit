"use client"
import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { RadioInput, type RadioOption } from '@rewardkit/packages/ui/components/input/radio.input'
import { cn } from '@rewardkit/lib/utils'

type EditRadioDialogProps<T extends string> = {
    title: string
    description?: string
    label: string
    value?: T | null
    options: readonly RadioOption<T>[]
    /** Return a falsy value (or throw) to keep the dialog open. */
    onSave: (value: T) => Promise<unknown> | unknown
    isSaving?: boolean
    saveLabel?: string
    cancelLabel?: string
    /** Overrides the trigger text. Defaults to the selected option's label. */
    children?: ReactNode
    triggerClassName?: string
    contentClassName?: string
    radioProps?: Omit<ComponentProps<typeof RadioInput>, 'label' | 'value' | 'onChange' | 'options'>
}

export const EditRadioDialog = <T extends string>({
    title,
    description,
    label,
    value,
    options,
    onSave,
    isSaving = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    children,
    triggerClassName,
    contentClassName,
    radioProps,
}: EditRadioDialogProps<T>) => {
    const closeRef = useRef<HTMLButtonElement>(null)
    const saved = value ?? null
    const [selected, setSelected] = useState<T | null>(saved)

    const currentLabel = options.find((o) => o.value === saved)?.label
    const isDirty = selected !== null && selected !== saved

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (selected === null || !isDirty) return
        const ok = await onSave(selected)
        if (ok) closeRef.current?.click() // close only on success
    }

    return (
        <Dialog onOpenChange={() => setSelected(saved)}>
            <DialogTrigger
                nativeButton={false}
                render={(props) => (
                    <div
                        {...props}
                        className={cn(
                            'flex min-w-0 items-center justify-end gap-2 text-sm font-medium tracking-tight outline-none focus-visible:outline-none focus-visible:ring-0',
                            triggerClassName
                        )}
                    >
                        <span className="truncate text-xsm">{children ?? currentLabel ?? '-'}</span>
                        <Button
                            variant="ghost"
                            className="size-6 min-w-fit shrink-0 rounded-sm px-0 py-0 text-muted-foreground"
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

                    <div className="flex flex-col gap-4 p-6 pt-0">
                        <RadioInput
                            {...radioProps}
                            label={label}
                            options={options}
                            value={selected}
                            onChange={setSelected}
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