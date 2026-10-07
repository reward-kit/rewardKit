"use client"
import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { CommandAvatarInput } from '@rewardkit/packages/ui/components/input/command.avatar.input'
import { cn } from '@rewardkit/lib/utils'

type InputProps = ComponentProps<typeof CommandAvatarInput>
type Option = NonNullable<InputProps['options']>[number]

type EditCommandAvatarDialogProps = {
    title: string
    description?: string
    label: string
    value?: string | null
    /** Same options you pass to CommandAvatarInput, so the flag/avatar data stays attached. */
    options: InputProps['options']
    /** Return a falsy value (or throw) to keep the dialog open. */
    onSave: (value: string) => Promise<unknown> | unknown
    isSaving?: boolean
    saveLabel?: string
    cancelLabel?: string
    placeholder?: string
    /** Custom trigger content. Receives the saved option so you can render its flag. */
    renderValue?: (option: Option | undefined) => ReactNode
    triggerClassName?: string
    contentClassName?: string
    inputProps?: Omit<InputProps, 'label' | 'value' | 'onChange' | 'options' | 'placeholder'>
}

export const EditCommandAvatarDialog = ({
    title,
    description,
    label,
    value,
    options,
    onSave,
    isSaving = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    placeholder,
    renderValue,
    triggerClassName,
    contentClassName,
    inputProps,
}: EditCommandAvatarDialogProps) => {
    const closeRef = useRef<HTMLButtonElement>(null)
    const saved = value ?? ''
    const [selected, setSelected] = useState(saved)

    const currentOption = options?.find((o) => String(o.value) === saved)
    const isDirty = !!selected && selected !== saved

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isDirty) return
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
                            'text-xsm flex font-medium justify-end tracking-tight items-center gap-2 outline-none focus-visible:outline-none focus-visible:ring-0',
                            triggerClassName
                        )}
                    >
                        {renderValue ? renderValue(currentOption) : (currentOption?.label ?? (saved || '-'))}
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
                        <CommandAvatarInput
                            labelClassName="text-muted-foreground"
                            {...inputProps}
                            label={label}
                            placeholder={placeholder}
                            options={options}
                            value={selected}
                            onChange={(val) => setSelected(val ?? '')}
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