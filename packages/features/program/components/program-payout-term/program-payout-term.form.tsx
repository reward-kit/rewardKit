import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { PAYOUT_TERM, type ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramPayoutTerm,
    type ProgramPayoutTermFormValues,
    type ProgramPayoutTermValues,
} from "@rewardkit/packages/types/program/program.validator"

export const PAYOUT_TERM_OPTIONS = [
    { label: "NET 15", value: String(PAYOUT_TERM.NET_15) },
    { label: "NET 30", value: String(PAYOUT_TERM.NET_30) },
    { label: "NET 45", value: String(PAYOUT_TERM.NET_45) },
    { label: "NET 60", value: String(PAYOUT_TERM.NET_60) },
]

interface ProgramPayoutTermFormProps {
    id?: string
    program?: Pick<ProgramResource, "payoutTerm"> | null
    onSubmit: (values: ProgramPayoutTermValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramPayoutTermForm = ({
    id = "program-payout-term-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramPayoutTermFormProps) => {
    const defaultValues: ProgramPayoutTermFormValues = {
        payoutTerm: String(program?.payoutTerm ?? PAYOUT_TERM.NET_30),
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramPayoutTerm },
        onSubmit: ({ value }) => onSubmit(ZProgramPayoutTerm.parse(value)),
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
                name="payoutTerm"
                children={(field) => (
                    <field.SelectField
                        hideLabel
                        placeholder="Select a payout term"
                        options={PAYOUT_TERM_OPTIONS}
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
