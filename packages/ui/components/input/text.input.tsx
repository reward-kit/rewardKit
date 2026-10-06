import React, { useState } from 'react'
import { Label } from '../label'
import { Input, InputWrapper } from '../input'
import { cn } from '@rewardkit/lib/utils';
import { IconEye, IconEyeOff, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { Spinner } from '@rewardkit/packages/ui/components/spinner';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    labelClassName?: string;
    required?: boolean;
    onChange?: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
    showVisibilityToggle?: boolean;
    parentClassName?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    suffix?: string;
}

export const TextInput = ({
    label,
    labelClassName,
    type = "text",
    required,
    onChange,
    showVisibilityToggle = false,
    parentClassName,
    isLoading = false,
    isSuccess = false,
    isError = false,
    errorMessage,
    onBlur,
    ...inputProps
}: TextInputProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const isPasswordType = type === "password"
    const prefix = inputProps.prefix;
    const suffix = inputProps.suffix;
    return (
        <div className={cn('flex flex-col gap-3 w-full', parentClassName)}>
            {label && (
                <Label className={cn(labelClassName, isError && "text-destructive")}>
                    {label}
                    {required && <span className='text-red-500 hidden ml-1'>*</span>}
                </Label>
            )}
            <InputWrapper
                className={cn(
                    "bg-transparent border pl-3 pr-3 overflow-hidden",
                    prefix && "pl-0",
                    suffix && "pr-0",
                    isError && "border-destructive focus-visible:ring-destructive",
                    isSuccess && "border-emerald-500 focus-visible:ring-emerald-500",
                    inputProps.className
                )}>
                {prefix && (
                    <p className="text-muted-foreground bg-muted/50 px-3 self-stretch flex items-center shrink-0 whitespace-nowrap rounded-l-sm">
                        {prefix}
                    </p>
                )}
                <Input
                    type={isPasswordType && showVisibilityToggle ? (isVisible ? "text" : "password") : type}
                    required={required}
                    onChange={(e) => onChange?.(e.target.value, e)}
                    onBlur={onBlur}
                    disabled={isLoading || inputProps.disabled}
                    prefix={inputProps.prefix}
                    {...inputProps}
                />
                {suffix && (
                    <p className="text-muted-foreground bg-muted/50 px-3 self-stretch flex items-center shrink-0 whitespace-nowrap rounded-r-sm">
                        {suffix}
                    </p>
                )}

                {/* Right Input Slot Actions & Indicators */}
                {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"> */}
                {/* Status Indicators */}
                {isLoading && !suffix && (
                    <Spinner className="size-4 text-muted-foreground" />
                )}

                {!isLoading && isSuccess && !suffix && (
                    <IconCheck size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-200" />
                )}

                {!isLoading && isError && !suffix && (
                    <IconAlertCircle size={18} className="text-destructive animate-in fade-in zoom-in duration-200" />
                )}

                {/* Password Visibility Toggle */}
                {isPasswordType && showVisibilityToggle && (
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className='cursor-pointer text-gray-500 hover:text-gray-700 transition-colors'
                    >
                        {isVisible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                )}
                {/* </div> */}
            </InputWrapper>

            {/* Error Message Feedback */}
            {isError && errorMessage && (
                <span className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}