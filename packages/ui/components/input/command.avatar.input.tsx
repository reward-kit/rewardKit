import React, { useRef, useState } from 'react'
import { Label } from '../label'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../popover'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import { cn } from '@rewardkit/lib/utils'
import { IconCheck, IconAlertCircle, IconChevronDown } from '@tabler/icons-react'
import { Spinner } from '@rewardkit/packages/ui/components/spinner'

export interface CommandAvatarOption {
    label: string
    value: string
    imageUrl?: string
}

interface CommandAvatarInputProps {
    label?: string
    labelClassName?: string
    required?: boolean
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    parentClassName?: string
    triggerClassName?: string
    disabled?: boolean
    isLoading?: boolean
    isSuccess?: boolean
    isError?: boolean
    errorMessage?: string
    size?: "sm" | "default"
    options?: CommandAvatarOption[]
}

export const CommandAvatarInput = ({
    label,
    labelClassName,
    required,
    placeholder = "Select item...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    value,
    onChange,
    onBlur,
    parentClassName,
    triggerClassName,
    disabled = false,
    isLoading = false,
    isSuccess = false,
    isError = false,
    errorMessage,
    size = "default",
    options = [],
}: CommandAvatarInputProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [triggerWidth, setTriggerWidth] = useState(0)
    const isDisabled = disabled || isLoading

    const selectedOption = options.find((opt) => opt.value === value)

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen && triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth)
        }
        setOpen(newOpen)
    }

    return (
        <div className={cn('flex flex-col gap-2.5 w-full', parentClassName)}>
            {label && (
                <Label className={cn(labelClassName, "text-xsm", isError && "text-destructive")}>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </Label>
            )}

            <div className='relative flex items-center'>
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger
                        ref={triggerRef}
                        render={(props) => (
                            <button
                                type="button"
                                disabled={isDisabled}
                                onBlur={onBlur}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-md border font-medium tracking-tight text-sm placeholder:text-muted-foreground focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                                    size === "sm" ? "h-8 px-3 text-xs" : "h-9 px-3 py-2",
                                    (isLoading || isSuccess || isError) ? 'pr-14' : 'pr-8',
                                    isError && "border-destructive focus:ring-destructive",
                                    isSuccess && "ring-1 focus:ring-1 focus:ring-emerald-500",
                                    triggerClassName
                                )}
                                {...props}
                            >
                                {selectedOption ? (
                                    <div className="flex text-xsm items-center gap-2 truncate">
                                        <Avatar className="size-5">
                                            {selectedOption.imageUrl && (
                                                <AvatarImage src={selectedOption.imageUrl} alt={selectedOption.label} />
                                            )}
                                            <AvatarFallback className="text-[10px]">
                                                {getInitials(selectedOption.label)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="truncate">{selectedOption.label}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground truncate">{placeholder}</span>
                                )}
                                <IconChevronDown className="size-4 shrink-0 opacity-50 absolute right-3 pointer-events-none" />
                            </button>
                        )}>

                    </PopoverTrigger>

                    <PopoverContent
                        style={{ width: `${triggerWidth}px` }}
                        className="p-0 w-[--radix-popover-trigger-width]"
                        sideOffset={6}
                        align="start">
                        <Command>
                            <CommandInput placeholder={searchPlaceholder} />
                            <CommandList>
                                <CommandEmpty>{emptyMessage}</CommandEmpty>
                                <CommandGroup>
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => {
                                                onChange?.(option.value)
                                                setOpen(false)
                                            }}
                                            className="flex text-xsm items-center justify-between gap-2 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Avatar className="size-5">
                                                    {option.imageUrl && <AvatarImage src={option.imageUrl} alt={option.label} />}
                                                    <AvatarFallback className="text-[9px]">
                                                        {getInitials(option.label)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate">{option.label}</span>
                                            </div>
                                            {value === option.value && (
                                                <IconCheck className="size-4 text-primary shrink-0" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Status Indicators Slot */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                    {isLoading && (
                        <Spinner className="size-4 text-muted-foreground" />
                    )}

                    {!isLoading && isSuccess && (
                        <IconCheck size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-200" />
                    )}

                    {!isLoading && isError && (
                        <IconAlertCircle size={18} className="text-destructive animate-in fade-in zoom-in duration-200" />
                    )}
                </div>
            </div>

            {/* Error Message Feedback */}
            {isError && errorMessage && (
                <span className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}