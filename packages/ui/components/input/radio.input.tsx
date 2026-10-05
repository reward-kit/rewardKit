import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Label } from '../label'
import { cn } from '@rewardkit/lib/utils'

export type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
}

type RadioInputProps<T extends string> = {
    label?: string
    required?: boolean
    value: T | null
    onChange: (value: T) => void
    options: readonly RadioOption<T>[]
    disabled?: boolean
    isError?: boolean
    errorMessage?: string
    parentClassName?: string
}

export const RadioInput = <T extends string>({
    label,
    required,
    value,
    onChange,
    options,
    disabled,
    isError,
    errorMessage,
    parentClassName,
}: RadioInputProps<T>) => (
    <div className={cn('flex w-full min-w-0 flex-col gap-3', parentClassName)}>
        {label && (
            <Label className={cn(isError && 'text-destructive')}>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>
        )}

        <RadioGroup
            value={value}
            onValueChange={(next) => onChange(next as T)}
            disabled={disabled}
            className="flex flex-col gap-2"
        >
            {options.map((o) => (
                <label
                    key={o.value}
                    className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50',
                        'has-data-checked:border-btn-primary has-data-checked:bg-muted/40',
                        disabled && 'cursor-not-allowed opacity-50'
                    )}
                >
                    <Radio.Root
                        value={o.value}
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:border-btn-primary"
                    >
                        <Radio.Indicator className="size-2 rounded-full bg-btn-primary" />
                    </Radio.Root>

                    <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium tracking-tight">{o.label}</span>
                        {o.description && (
                            <span className="text-xs text-muted-foreground">{o.description}</span>
                        )}
                    </span>
                </label>
            ))}
        </RadioGroup>

        {isError && errorMessage && (
            <span className="text-xs text-destructive">{errorMessage}</span>
        )}
    </div>
)