import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramCookieDuration,
    type ProgramCookieDurationFormValues,
    type ProgramCookieDurationValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramCookieDurationFormProps {
    id?: string
    program?: Pick<ProgramResource, "cookieDuration"> | null
    onSubmit: (values: ProgramCookieDurationValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramCookieDurationForm = ({
    id = "program-cookie-duration-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramCookieDurationFormProps) => {
    const defaultValues: ProgramCookieDurationFormValues = {
        cookieDuration: program?.cookieDuration == null ? "" : String(program.cookieDuration),
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramCookieDuration },
        onSubmit: ({ value }) => onSubmit(ZProgramCookieDuration.parse(value)),
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
                name="cookieDuration"
                children={(field) => (
                    <field.TextField
                        hideLabel
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="365"
                        suffix="days"
                        placeholder="e.g. 30"
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
