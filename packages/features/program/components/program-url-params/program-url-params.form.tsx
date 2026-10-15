import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { URL_PARAMETER, type ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramUrlParams,
    type ProgramUrlParamsFormValues,
    type ProgramUrlParamsValues,
} from "@rewardkit/packages/types/program/program.validator"

export const URL_PARAMETER_OPTIONS = [
    { label: "?ref=", value: URL_PARAMETER.REF },
    { label: "?via=", value: URL_PARAMETER.VIA },
    { label: "?aff=", value: URL_PARAMETER.AFF },
]

interface ProgramUrlParamsFormProps {
    id?: string
    program?: Pick<ProgramResource, "urlParams"> | null
    onSubmit: (values: ProgramUrlParamsValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramUrlParamsForm = ({
    id = "program-url-params-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramUrlParamsFormProps) => {
    const defaultValues: ProgramUrlParamsFormValues = {
        urlParams: program?.urlParams ?? [],
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramUrlParams },
        onSubmit: ({ value }) => onSubmit(ZProgramUrlParams.parse(value)),
    })

    return (
        <form
            id={id}
            noValidate
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <form.AppField
                name="urlParams"
                children={(field) => (
                    <field.MultiSelectField
                        placeholder="Select URL parameters"
                        options={URL_PARAMETER_OPTIONS}
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.isDefaultValue}>
                {(isDefaultValue) => (
                    <DirtyReporter isDefaultValue={isDefaultValue} onDirtyChange={onDirtyChange} />
                )}
            </form.Subscribe>
        </form>
    )
}
