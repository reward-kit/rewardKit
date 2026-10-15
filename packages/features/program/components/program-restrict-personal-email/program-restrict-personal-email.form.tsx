import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramRestrictPersonalEmail,
    type ProgramRestrictPersonalEmailFormValues,
    type ProgramRestrictPersonalEmailValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramRestrictPersonalEmailFormProps {
    id?: string
    program?: Pick<ProgramResource, "restrictPersonalEmail"> | null
    onSubmit: (values: ProgramRestrictPersonalEmailValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramRestrictPersonalEmailForm = ({
    id = "program-restrict-personal-email-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramRestrictPersonalEmailFormProps) => {
    const defaultValues: ProgramRestrictPersonalEmailFormValues = {
        restrictPersonalEmail: program?.restrictPersonalEmail ?? false,
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramRestrictPersonalEmail },
        onSubmit: ({ value }) => onSubmit(ZProgramRestrictPersonalEmail.parse(value)),
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
                name="restrictPersonalEmail"
                children={(field) => (
                    <field.SwitchField
                        description="Require partners to sign up with a business email address"
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
