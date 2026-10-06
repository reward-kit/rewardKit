// chip-select.tsx
import React, { useState } from 'react'
import { cn } from '@rewardkit/lib/utils'
import { Label } from '../label'
import { Button } from '../button'

export interface ChipOption {
    label: string
    value: string
}

interface ChipSelectProps {
    label?: string
    labelClassName?: string
    required?: boolean
    parentClassName?: string
    className?: string
    isError?: boolean
    errorMessage?: string
    disabled?: boolean

    options: ChipOption[]                 // the 4 buttons
    value?: string
    onChange?: (value: string) => void

    otherLabel?: string                   // default "Other"
    /** Rendered when "Other" is clicked. Pass your command/avatar input here. */
    renderOther?: (ctx: {
        value?: string
        onChange: (value: string) => void
        close: () => void
    }) => React.ReactNode
}

export const ChipSelectInput = ({
    label,
    labelClassName,
    required,
    parentClassName,
    className,
    isError = false,
    errorMessage,
    disabled,
    options,
    value,
    onChange,
    otherLabel = 'Other',
    renderOther,
}: ChipSelectProps) => {
    const [otherOpen, setOtherOpen] = useState(false)

    const isInOptions = options.some((o) => o.value === value)
    // Other is active if it's open, or the current value isn't one of the buttons
    const otherActive = otherOpen || (!!value && !isInOptions)

    const chipClass = (active: boolean) =>
        cn(
            'h-8 min-w-fit px-4 rounded-lg border bg-card text-sm font-medium transition-colors',
            'hover:bg-muted/60 disabled:opacity-60 disabled:cursor-not-allowed',
            active && 'border-foreground/10 bg-muted',
            isError && !active && 'border-destructive'
        )

    return (
        <div className={cn('flex flex-col gap-3 w-full', parentClassName)}>
            {label && (
                <Label className={cn(labelClassName, isError && 'text-destructive')}>
                    {label}
                    {required && <span className="text-red-500 hidden ml-1">*</span>}
                </Label>
            )}

            <div className={cn('flex flex-wrap gap-2', className)}>
                {options.map((o) => (
                    <Button
                        variant={"outline"}
                        key={o.value}
                        type="button"
                        disabled={disabled}
                        className={chipClass(!otherOpen && value === o.value)}
                        onClick={() => {
                            setOtherOpen(false)
                            onChange?.(o.value)
                        }}
                    >
                        {o.label}
                    </Button>
                ))}

                {renderOther && (
                    <Button
                        type="button"
                        variant={"outline"}
                        disabled={disabled}
                        className={chipClass(otherActive)}
                        onClick={() => setOtherOpen(true)}
                    >
                        {otherLabel}
                    </Button>
                )}
            </div>

            {renderOther && otherActive && (
                <div className="animate-in fade-in slide-in-from-top-1">
                    {renderOther({
                        value: isInOptions ? undefined : value,
                        onChange: (v) => onChange?.(v),
                        close: () => setOtherOpen(false),
                    })}
                </div>
            )}

            {isError && errorMessage && (
                <span className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}