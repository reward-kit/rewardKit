"use client"

import {
    useEffect,
    useRef,
    type ChangeEvent,
    type ClipboardEvent,
    type KeyboardEvent,
} from "react"
import { Input } from "@rewardkit/packages/ui/components/input"

type OtpInputProps = {
    length?: number
    value: string
    onChange: (value: string) => void
    /** Called when every box is filled (typed, pasted, or autofilled) */
    onComplete?: (value: string) => void
    invalid?: boolean
    /** Focus the first box on mount and whenever the value is cleared */
    autoFocus?: boolean
    /** Put on the first box so a <Label htmlFor> can point at it */
    id?: string
}

export function OtpInput({
    length = 6,
    value,
    onChange,
    onComplete,
    invalid,
    autoFocus = true,
    id,
}: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (autoFocus && value === "") refs.current[0]?.focus()
    }, [autoFocus, value])

    const focusBox = (index: number) => {
        refs.current[Math.max(0, Math.min(index, length - 1))]?.focus()
    }

    const commit = (next: string, focusIndex: number) => {
        onChange(next)
        focusBox(focusIndex)
        if (next.length === length) onComplete?.(next)
    }

    const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
        // Boxes fill left to right, so never write past the first empty one
        const at = Math.min(i, value.length)
        let raw = e.target.value.replace(/\D/g, "")

        // Box was cleared (cut, or backspace on some mobile keyboards)
        if (!raw) {
            if (i < value.length) commit(value.slice(0, i) + value.slice(i + 1), i)
            return
        }

        // Typed into a filled box without selecting it: keep only the new digit
        const existing = value[i] ?? ""
        if (existing && raw.length === 2) {
            raw = raw[0] === existing ? raw[1] : raw[0]
        }

        // One digit: set this box and move on
        if (raw.length === 1) {
            commit(value.slice(0, at) + raw + value.slice(at + 1), at + 1)
            return
        }

        // Several digits at once (autofill / SMS suggestion). A full code replaces everything.
        const start = raw.length >= length ? 0 : at
        const next = (value.slice(0, start) + raw).slice(0, length)
        commit(next, next.length)
    }

    const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData("text").replace(/\D/g, "")
        if (!text) return

        const start = text.length >= length ? 0 : Math.min(i, value.length)
        const next = (value.slice(0, start) + text).slice(0, length)
        commit(next, next.length)
    }

    const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Backspace on an empty box: delete the previous digit and step back
        if (e.key === "Backspace" && !value[i]) {
            e.preventDefault()
            if (value.length > 0) commit(value.slice(0, -1), value.length - 1)
            return
        }
        if (e.key === "ArrowLeft") {
            e.preventDefault()
            focusBox(i - 1)
        }
        if (e.key === "ArrowRight") {
            e.preventDefault()
            focusBox(Math.min(i + 1, value.length))
        }
    }

    const activeIndex = Math.min(value.length, length - 1)

    return (
        <div role="group" aria-label="One-time code" className="flex w-full gap-2">
            {Array.from({ length }, (_, i) => (
                <Input
                    key={i}
                    ref={(el) => {
                        refs.current[i] = el
                    }}
                    id={i === 0 ? id : undefined}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    // First box gets the whole code when the browser autofills it
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1} of ${length}`}
                    aria-invalid={invalid || undefined}
                    // Tab enters the group once, at the box that needs input
                    tabIndex={i === activeIndex ? 0 : -1}
                    value={value[i] ?? ""}
                    onChange={(e) => handleChange(i, e)}
                    onPaste={(e) => handlePaste(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className={`h-12 min-w-0 flex-1 rounded-md px-0 text-center text-lg font-semibold ${invalid ? "border-red-500" : ""
                        }`}
                />
            ))}
        </div>
    )
}