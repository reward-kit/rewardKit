import { useState, type ReactNode } from 'react'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'
import { Label } from '../label'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../command'
import { cn } from '@rewardkit/lib/utils'
import { Image } from '../image'

type Option = { label: string; value: string, imageUrl?: string }

interface MultiSelectInputProps {
    label?: string
    required?: boolean
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: ReactNode
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
    isError?: boolean
    errorMessage?: string
    parentClassName?: string
}

export const MultiSelectInput = ({
    label,
    required,
    placeholder = 'Select options',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    options,
    value,
    onChange,
    disabled,
    isError,
    errorMessage,
    parentClassName,
}: MultiSelectInputProps) => {
    const [open, setOpen] = useState(false)

    const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v)

    const toggle = (v: string) =>
        onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

    return (
        <div className={cn('flex flex-col gap-2.5 w-full min-w-0', parentClassName)}>
            {label && (
                <Label className={cn(isError && 'text-destructive')}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    disabled={disabled}
                    render={
                        <button
                            type="button"
                            className={cn(
                                'flex h-10.5 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50',
                                isError && 'border-destructive'
                            )}
                        />
                    }
                >
                    {selectedLabels.length ? (
                        <span className="flex min-w-0 max-w-xs items-center gap-2">
                            <span className="truncate">{selectedLabels.join(", ")}</span>
                        </span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <IconChevronDown size={16} className="shrink-0 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent align="start" className="w-(--anchor-width) p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList className="max-h-64 mt-1.75">
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            {options.map((o) => (
                                <CommandItem
                                    key={o.value}
                                    // searchable text: "India IN" matches both name and code
                                    value={`${o.label} ${o.value}`}
                                    onSelect={() => toggle(o.value)}
                                >
                                    <div className='flex items-center gap-0.5'>
                                        {o.imageUrl && <Image className='size-4' src={o.imageUrl} alt={o.label} />}
                                        <span className="flex-1 truncate">{o.label}</span>
                                    </div>
                                    {value.includes(o.value) && <IconCheck size={16} />}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {isError && errorMessage && (
                <span className="text-xs text-destructive">{errorMessage}</span>
            )}
        </div>
    )
}