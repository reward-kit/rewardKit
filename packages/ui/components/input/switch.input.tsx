import React, { useId } from 'react'
import { Label } from '../label'
import { Switch } from '../switch'
import { cn } from '@rewardkit/lib/utils';

interface SwitchInputProps {
    label?: string;
    labelClassName?: string;
    /** text shown inside the bordered box, next to the switch */
    description?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "default";
    parentClassName?: string;
    className?: string;
    isError?: boolean;
    errorMessage?: string;
    hint?: string;
}

export const SwitchInput = ({
    label,
    labelClassName,
    description,
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    size = "default",
    parentClassName,
    className,
    isError = false,
    errorMessage,
    hint,
}: SwitchInputProps) => {
    const id = useId()

    return (
        <div className={cn('flex flex-col gap-3 w-full', parentClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(labelClassName, isError && "text-destructive")}>
                    {label}
                </Label>
            )}

            {/* the whole box is the click target, not just the switch */}
            <label
                htmlFor={id}
                className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg border bg-transparent px-3 py-2.5",
                    "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                    isError && "border-destructive",
                    disabled && "cursor-not-allowed opacity-50",
                    className
                )}
            >
                {description && (
                    <span className="text-xsm tracking-tight text-muted-foreground select-none">
                        {description}
                    </span>
                )}
                <Switch
                    id={id}
                    size={size}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    onCheckedChange={(value) => onChange?.(value)}
                    className="ml-auto"
                />
            </label>

            {hint && (
                <span className="text-xs italic text-muted-foreground">
                    {hint}
                </span>
            )}
            {isError && errorMessage && (
                <span className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}