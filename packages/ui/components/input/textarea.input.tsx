import React from 'react'
import { Label } from '../label'
import { Textarea } from '../textarea'
import { cn } from '@rewardkit/lib/utils'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'

interface TextareaInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    labelClassName?: string;
    required?: boolean;
    onChange?: (value: string) => void;
    parentClassName?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
}

export const TextareaInput = ({
    label,
    labelClassName,
    required,
    onChange,
    parentClassName,
    isLoading = false,
    isSuccess = false,
    isError = false,
    errorMessage,
    onBlur,
    rows = 4,
    ...textareaProps
}: TextareaInputProps) => {
    return (
        <div className={cn('flex flex-col gap-2.5 w-full', parentClassName)}>
            {label && (
                <Label className={cn(labelClassName, isError && "text-destructive")}>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </Label>
            )}
            <div className='relative flex items-start'>
                <Textarea
                    rows={rows}
                    required={required}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={onBlur}
                    disabled={isLoading || textareaProps.disabled}
                    className={cn(
                        // Add right padding to prevent text overlapping status icons
                        (isLoading || isSuccess || isError) ? 'pr-10' : '',
                        isError && "border-destructive focus-visible:ring-destructive",
                        isSuccess && "border-emerald-500 focus-visible:ring-emerald-500",
                        textareaProps.className
                    )}
                    {...textareaProps}
                />

                {/* Right Input Slot Status Indicators */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
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