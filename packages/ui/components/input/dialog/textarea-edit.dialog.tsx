"use client"
import { useCallback, useRef, type ComponentProps, type ReactNode } from 'react'
import { PencilLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { TextareaInput } from '@rewardkit/packages/ui/components/input/textarea.input'
import { cn } from '@rewardkit/lib/utils'

type TextareaEditDialogProps = {
    title: string
    description?: string
    label: string
    name: string
    value?: string | null
    /** Return a falsy value (or throw) to keep the dialog open. */
    onSave: (value: string) => Promise<unknown> | unknown
    isSaving?: boolean
    saveLabel?: string
    cancelLabel?: string
    /** What the trigger displays next to the pencil icon. */
    children?: ReactNode
    triggerClassName?: string
    contentClassName?: string
    error?: string
    rows?: number
    maxLength?: number
    placeholder?: string
    inputProps?: Omit<ComponentProps<typeof TextareaInput>, 'name' | 'label' | 'defaultValue'>
}

const getValue = (form: HTMLFormElement, name: string) =>
    ((new FormData(form).get(name) as string) ?? '').trim()

export const TextareaEditDialog = ({
    title,
    description,
    label,
    name,
    value,
    onSave,
    isSaving = false,
    saveLabel = 'Save changes',
    cancelLabel = 'Cancel',
    children,
    triggerClassName,
    contentClassName,
    error,
    rows,
    maxLength,
    placeholder,
    inputProps,
}: TextareaEditDialogProps) => {
    const closeRef = useRef<HTMLButtonElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)

    const setSubmitRef = useCallback((el: HTMLButtonElement | null) => {
        submitRef.current = el
        if (el) el.disabled = true
    }, [])

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fieldValue = getValue(e.currentTarget, name)

        const saved = await onSave(fieldValue)
        if (saved) closeRef.current?.click() // close only on success
    }

    const onChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        if (submitRef.current) {
            submitRef.current.disabled = getValue(e.currentTarget, name) === (value ?? '').trim()
        }
    }

    return (
        <Dialog>
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
                        <span className='inline-block max-w-48 truncate'>{children ?? (value || '-')}</span>
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
                <form onSubmit={onSubmit} onChange={onChange}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <div className="p-6 pt-0 flex flex-col gap-4">
                        <TextareaInput
                            label={label}
                            name={name}
                            rows={rows}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            defaultValue={value ?? ''}
                            {...inputProps}
                        />
                        {error}
                    </div>

                    <DialogFooter>
                        <DialogClose ref={closeRef} render={<Button type="button" size="sm" variant="ghost" />}>
                            {cancelLabel}
                        </DialogClose>
                        <Button isLoading={isSaving} ref={setSubmitRef} type="submit" size="sm" disabled={isSaving}>
                            {saveLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
