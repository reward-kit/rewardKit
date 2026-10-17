import { useMemo } from "react"
import type { z } from "zod"
import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { toOptionalString } from "@rewardkit/hooks/useForm"
import { ZLinkData } from "@rewardkit/packages/types/link/link.api.schema"
import { URL_PARAMETER, type UrlParameter } from "@rewardkit/packages/types/program/program.schema"
import { buildLinkPreview, getParamOptions } from "../../lib/link.constants"
import { TextInput } from "@rewardkit/packages/ui/components/input/text.input"

const linkSchema = ZLinkData
export type LinkCreateValues = z.output<typeof linkSchema>

type FormValues = {
    code: string
    // plain string: the select hands back strings, the schema enforces the enum
    urlParam: string
}

// raw form values -> API input
const toInput = (v: FormValues) => ({
    code: toOptionalString(v.code),
    urlParam: v.urlParam || undefined,
})

// run the API schema on the mapped input and turn zod issues into per-field errors
const validate = ({ value }: { value: FormValues }) => {
    const result = linkSchema.safeParse(toInput(value))
    if (result.success) return undefined
    const fields: Record<string, string> = {}
    for (const issue of result.error.issues) {
        const key = issue.path.join(".")
        fields[key] ??= issue.message
    }
    return { fields }
}

interface LinkCreateFormProps {
    id: string
    /** parameters the program allows; falls back to every supported one */
    urlParams?: UrlParameter[] | null
    websiteUrl?: string
    onSubmit: (values: LinkCreateValues) => void
}

export const LinkCreateForm = ({ id, urlParams, websiteUrl, onSubmit }: LinkCreateFormProps) => {
    const paramOptions = useMemo(() => getParamOptions(urlParams), [urlParams])

    const form = useAppForm({
        defaultValues: {
            code: "",
            urlParam: paramOptions[0]?.value ?? URL_PARAMETER.REF,
        } as FormValues,
        validators: { onChange: validate },
        onSubmit: ({ value }) => {
            onSubmit(linkSchema.parse(toInput(value)))
        },
    })

    return (
        <form
            id={id}
            noValidate
            className="flex flex-col gap-4 px-1"
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <form.AppField name="urlParam" children={(field) => (
                <field.SelectField
                    label="URL parameter"
                    placeholder="Select parameter"
                    options={paramOptions}
                />
            )} />
            <form.AppField name="code" children={(field) => (
                <field.TextField
                    label="Link code (Optional)"
                    placeholder="e.g. jane-summer"
                    autoFocus
                />
            )} />

            <form.Subscribe selector={(state) => state.values}>
                {(values) => (
                    <TextInput
                        label="Link"
                        value={buildLinkPreview(websiteUrl, values.urlParam, values.code)}
                        disabled
                        hint={values.code.trim() ? undefined : "No code entered, we'll generate one from the partner's name."}
                    />
                )}
            </form.Subscribe>
        </form>
    )
}