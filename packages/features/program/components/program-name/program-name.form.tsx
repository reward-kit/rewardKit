import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramName,
    type ProgramNameFormValues,
    type ProgramNameValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramNameFormProps {
    id?: string
    program?: Pick<ProgramResource, "name"> | null
    onSubmit: (values: ProgramNameValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramNameForm = ({
    id = "program-name-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramNameFormProps) => {
    const defaultValues: ProgramNameFormValues = {
        name: program?.name ?? "",
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramName },
        onSubmit: ({ value }) => onSubmit(ZProgramName.parse(value)),
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
                name="name"
                children={(field) => (
                    <field.TextField hideLabel placeholder="e.g. Acme Affiliates" />
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
