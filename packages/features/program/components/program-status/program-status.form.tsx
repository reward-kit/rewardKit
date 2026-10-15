import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import {
    PROGRAM_STATUS,
    type ProgramResource,
    type ProgramStatus,
} from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramStatus,
    type ProgramStatusFormValues,
    type ProgramStatusValues,
} from "@rewardkit/packages/types/program/program.validator"

export const PROGRAM_STATUS_OPTIONS = [
    { label: "Active", value: PROGRAM_STATUS.ACTIVE },
    { label: "Inactive", value: PROGRAM_STATUS.INACTIVE },
]

interface ProgramStatusFormProps {
    id?: string
    program?: Pick<ProgramResource, "status"> | null
    onSubmit: (values: ProgramStatusValues) => void
    onDirtyChange?: (dirty: boolean) => void
    onStatusChange?: (status: ProgramStatus) => void
}

export const ProgramStatusForm = ({
    id = "program-status-form",
    program,
    onSubmit,
    onDirtyChange,
    onStatusChange,
}: ProgramStatusFormProps) => {
    const defaultValues: ProgramStatusFormValues = {
        status: program?.status ?? PROGRAM_STATUS.ACTIVE,
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramStatus },
        onSubmit: ({ value }) => onSubmit(ZProgramStatus.parse(value)),
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
                name="status"
                listeners={{
                    onChange: ({ value }) => onStatusChange?.(value as ProgramStatus),
                }}
                children={(field) => (
                    <field.SelectField
                        hideLabel
                        label="Status"
                        placeholder="Select a status"
                        options={PROGRAM_STATUS_OPTIONS}
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
