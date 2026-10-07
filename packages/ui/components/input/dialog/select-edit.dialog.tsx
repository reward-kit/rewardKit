"use client"
import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { SelectInput } from '@rewardkit/packages/ui/components/input/select.input'
import { cn } from '@rewardkit/lib/utils'

type Option<T extends string | number> = { label: string; value: T }

type EditSelectDialogProps<T extends string | number> = {
    title: string
    description?: string
    label: string
    value?: T | null
    options: readonly Option<T>[]
    /** Receives the option's original value (a number stays a number). Return a falsy value (or throw) to keep the dialog open. */
    onSave: (value: T) => Promise<unknown> | unknown
    isSaving?: boolean
    saveLabel?: string
    cancelLabel?: string
    placeholder?: string
    /** What the trigger displays next to the pencil icon. Defaults to the selected option's label. */
    children?: ReactNode
    triggerClassName?: string
    contentClassName?: string
    selectProps?: Omit<
        ComponentProps<typeof SelectInput>,
        'label' | 'value' | 'onChange' | 'options' | 'placeholder'
    >
    isMultiple?: boolean
}

export const EditSelectDialog = <T extends string | number>({
    title,
    description,
    label,
    value,
    options,
    onSave,
    isSaving = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    placeholder = 'Select an option',
    children,
    triggerClassName,
    contentClassName,
    selectProps,
}: EditSelectDialogProps<T>) => {
    const closeRef = useRef<HTMLButtonElement>(null)

    const savedKey = value != null ? String(value) : ''
    const [selected, setSelected] = useState(savedKey)

    const currentLabel = options.find((o) => String(o.value) === savedKey)?.label
    const isDirty = !!selected && selected !== savedKey

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const option = options.find((o) => String(o.value) === selected)
        if (!option || !isDirty) return

        const saved = await onSave(option.value) // original type, not the string key
        if (saved) closeRef.current?.click() // close only on success
    }

    return (
        <Dialog onOpenChange={() => setSelected(savedKey)}>
            <DialogTrigger
                nativeButton={false}
                render={(props) => (
                    <div
                        {...props}
                        className={cn(
                            'text-xsm flex justify-end font-medium tracking-tight items-center gap-2 outline-none focus-visible:outline-none focus-visible:ring-0',
                            triggerClassName
                        )}
                    >
                        {children ?? currentLabel ?? (savedKey || '-')}
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
                        <SelectInput
                            {...selectProps}
                            label={label}
                            placeholder={placeholder}
                            options={options.map((o) => ({ label: o.label, value: String(o.value) }))}
                            value={selected}
                            onChange={(val) => setSelected(typeof val === 'string' ? val : '')}
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