"use client"
import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { MultiSelectInput } from '@rewardkit/packages/ui/components/input/multi-select.input'
import { cn } from '@rewardkit/lib/utils'
import { Image } from '../../image'

type Option<T extends string | number> = { label: string; value: T, imageUrl?: string }

type EditMultiSelectDialogProps<T extends string | number> = {
    title: string
    description?: string
    label: string
    value?: readonly T[] | null
    options: readonly Option<T>[]
    /** Receives the selected values in option order. Return a falsy value (or throw) to keep the dialog open. */
    onSave: (values: T[]) => Promise<unknown> | unknown
    isSaving?: boolean
    /** Allow saving an empty selection. Defaults to false. */
    allowEmpty?: boolean
    saveLabel?: string
    cancelLabel?: string
    placeholder?: string
    children?: ReactNode
    triggerClassName?: string
    contentClassName?: string
    selectProps?: Omit<
        ComponentProps<typeof MultiSelectInput>,
        'label' | 'value' | 'onChange' | 'options' | 'placeholder' | 'isMultiple'
    >
}

const sameSet = (a: string[], b: string[]) =>
    a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|')

export const EditMultiSelectDialog = <T extends string | number>({
    title,
    description,
    label,
    value,
    options,
    onSave,
    isSaving = false,
    allowEmpty = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    placeholder = 'Select options',
    children,
    triggerClassName,
    contentClassName,
    selectProps,
}: EditMultiSelectDialogProps<T>) => {
    const closeRef = useRef<HTMLButtonElement>(null)

    const savedKeys = (value ?? []).map(String)
    const savedOptions = savedKeys.map(
        (k) => options.find((o) => String(o.value) === k) ?? { label: k, value: k, imageUrl: k }
    )
    const [selected, setSelected] = useState<string[]>(savedKeys)

    const currentLabel = savedOptions.length ? (
        <span className="block min-w-0 truncate">
            {savedOptions.map((o, i) => (
                <span key={String(o.value)}>
                    {o.imageUrl && (
                        <Image
                            src={o.imageUrl}
                            alt=""
                            className="mr-1 inline-block size-3 align-[-1px]"
                        />
                    )}
                    {o.label}
                    {i < savedOptions.length - 1 && ', '}
                </span>
            ))}
        </span>
    ) : null

    const isDirty = !sameSet(selected, savedKeys) && (allowEmpty || selected.length > 0)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isDirty) return

        // map keys back to the original typed values, in option order
        const values = options.filter((o) => selected.includes(String(o.value))).map((o) => o.value)
        const saved = await onSave(values)
        if (saved) closeRef.current?.click() // close only on success
    }

    return (
        <Dialog onOpenChange={() => setSelected(savedKeys)}>
            <DialogTrigger
                nativeButton={false}
                render={(props) => (
                    <div
                        {...props}
                        className={cn(
                            'text-xsm flex min-w-0 justify-end font-medium tracking-tight items-center gap-2 outline-none focus-visible:outline-none focus-visible:ring-0',
                            triggerClassName
                        )}
                    >
                        {children ?? currentLabel ?? '-'}
                        <Button
                            variant="ghost"
                            className="min-w-fit shrink-0 px-0 py-0 rounded-sm text-muted-foreground size-6"
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

                    <div className="p-6 pt-0 flex flex-col max-w-full gap-4">
                        <MultiSelectInput
                            {...selectProps}
                            label={label}
                            placeholder={placeholder}
                            options={options.map((o) => ({ label: o.label, value: String(o.value), imageUrl: o.imageUrl }))}
                            value={selected}
                            onChange={(val) => setSelected(Array.isArray(val) ? val : [])}
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