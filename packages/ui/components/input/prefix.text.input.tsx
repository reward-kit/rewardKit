import React, { useState, useEffect } from 'react';
import { TextInput } from './text.input';
import { formatMinorAmount } from '@rewardkit/lib/amount/formatMinorAmount';
import currencyMap from "currency-symbol-map";

const toEditString = (minor?: number): string => {
    if (minor == null || isNaN(minor)) return "";
    // Avoid trailing .00 if it's whole, or format as fixed decimal string
    return (minor / 100).toString();
};

export interface AmountInputProps extends Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChange' | 'onBlur' | 'type'> {
    value?: number;
    onChange?: (minorUnits: number) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>, minorUnits: number) => void;
    prefix?: string;
    suffix?: string
}

export const PrefixTextInput = ({
    value,
    onChange,
    prefix,
    suffix,
    onFocus,
    onBlur,
    ...textInputProps
}: AmountInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [editValue, setEditValue] = useState<string>(() => toEditString(value));

    // Keep internal raw string in sync with external minor unit value while idle
    useEffect(() => {
        if (!isFocused) {
            setEditValue(toEditString(value));
        }
    }, [value, isFocused]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setEditValue(toEditString(value));
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e, value ?? 0);
    };

    const handleChange = (val: string) => {
        // Strip out non-numeric/decimal characters
        const cleaned = val.replace(/[^0-9.]/g, '');

        // Prevent multiple decimal points or > 2 decimal places
        if (cleaned !== '' && !/^\d*\.?\d{0,2}$/.test(cleaned)) {
            return;
        }

        setEditValue(cleaned);

        if (cleaned === '' || cleaned === '.') {
            onChange?.(0);
            return;
        }

        // Convert major unit string input (e.g., "58") to minor units (5800)
        const numericMajor = parseFloat(cleaned);
        if (!isNaN(numericMajor)) {
            const minorUnits = Math.round(numericMajor * 100);
            onChange?.(minorUnits);
        }
    };

    const resolvedDisplay = isFocused ? editValue : formatMinorAmount(value);

    return (
        <TextInput
            {...textInputProps}
            type="text"
            inputMode="decimal"
            value={resolvedDisplay}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            prefix={prefix}
            suffix={suffix}
        />
    );
};