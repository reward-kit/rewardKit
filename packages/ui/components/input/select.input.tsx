import React, { ComponentProps } from 'react'
import { Label } from '../label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select'
import { cn } from '@rewardkit/lib/utils'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { Spinner } from '@rewardkit/packages/ui/components/spinner'

interface SelectInputProps {
    label?: string;
    labelClassName?: string;
    required?: boolean;
    placeholder?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    onBlur?: () => void;
    parentClassName?: string;
    triggerClassName?: string;
    disabled?: boolean;
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    size?: "sm" | "default";
    children?: React.ReactNode;
    options?: Array<{ label: string; value: string | number }>;
    selectProps?: ComponentProps<typeof Select>
}

export const SelectInput = ({
    label,
    labelClassName,
    required,
    placeholder,
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
    children,
    options,
    selectProps
}: SelectInputProps) => {
    const isDisabled = disabled || isLoading

    return (
        <div className={cn('flex flex-col gap-2.5 w-full', parentClassName)}>
            {label && (
                <Label className={cn(labelClassName, isError && "text-destructive")}>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </Label>
            )}

            <div className='relative flex items-center'>
                <Select
                    value={value}
                    items={options}
                    onValueChange={(next) => onChange?.(next as string | null)}
                    disabled={isDisabled}
                    {...selectProps}
                >
                    <SelectTrigger
                        size={size}
                        onBlur={onBlur}
                        className={cn(
                            "w-full",
                            // Add right padding to ensure text/chevron doesn't overlap status icons
                            (isLoading || isSuccess || isError) ? 'pr-10' : '',
                            isError && "border-destructive focus:ring-destructive",
                            isSuccess && "border-emerald-500 focus:ring-emerald-500",
                            triggerClassName
                        )}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent align='start' className={"border-input"} alignItemWithTrigger={false} >
                        {children || (
                            options?.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                {/* Status Indicators Slot */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
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