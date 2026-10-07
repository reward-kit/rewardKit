"use client"
import { useState } from "react"
import z from "zod"

type Errors = Record<string, string | undefined>

/**
 * Generic form state + zod validation.
 * - `initialValues`: raw input values (usually strings, as typed in the inputs)
 * - `toInput`: turns raw values into what the schema expects (trim, string -> number, ...)
 * - `errorKeys`: only needed when a form key differs from the schema key ({ websiteUrl: "website" })
 * Flat forms only: errors are read from the first segment of each issue path.
 */
export function useSchemaForm<TSchema extends z.ZodType, TValues extends Record<string, any>>({
    schema,
    initialValues,
    toInput = (values) => values,
    errorKeys = {},
}: {
    schema: TSchema
    initialValues: TValues
    toInput?: (values: TValues) => unknown
    errorKeys?: Record<string, string>
}) {
    const [values, setValues] = useState<TValues>(initialValues)
    const [errors, setErrors] = useState<Errors>({})

    const setValue = <K extends keyof TValues & string>(key: K, value: TValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }))
        // clear a field's error as soon as the user edits it
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }

    const reset = () => {
        setValues(initialValues)
        setErrors({})
    }

    /** returns the parsed, typed data, or null after filling `errors` */
    const validate = (): z.infer<TSchema> | null => {
        const result = schema.safeParse(toInput(values))
        if (result.success) {
            setErrors({})
            return result.data as z.infer<TSchema>
        }
        const next: Errors = {}
        for (const issue of result.error.issues) {
            const path = String(issue.path[0])
            next[errorKeys[path] ?? path] ??= issue.message // first message per field
        }
        setErrors(next)
        return null
    }

    /** onSubmit handler: validates, then calls `onValid` with typed data */
    const handleSubmit = (onValid: (data: z.infer<TSchema>) => void | Promise<void>) =>
        async (e?: { preventDefault: () => void }) => {
            e?.preventDefault()
            const data = validate()
            if (data) await onValid(data)
        }

    /** spread onto TextInput / TextareaInput: <TextInput {...form.field("name")} /> */
    const field = (key: keyof TValues & string) => ({
        value: values[key] as string,
        onChange: (value: string) => setValue(key, value as TValues[typeof key]),
        isError: !!errors[key],
        errorMessage: errors[key],
    })

    return { values, errors, setValue, field, validate, handleSubmit, reset }
}

// small input -> schema converters, reusable in any toInput
export const toOptionalString = (v: string) => v.trim() || undefined
export const toOptionalNumber = (v: string) => (v.trim() === "" ? undefined : Number(v))
export const toWebsiteUrl = (v: string) => {
    // accept pasted urls too: strip the protocol and trailing slashes
    const host = v.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "")
    return host ? `https://${host}` : undefined
}