import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { fromMinorUnits } from "@rewardkit/lib/amount/money"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramPayoutMinimumThreshold,
    type ProgramPayoutMinimumThresholdFormValues,
    type ProgramPayoutMinimumThresholdValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramPayoutMinimumThresholdFormProps {
    id?: string
    program?: Pick<ProgramResource, "payoutMinimumThreshold" | "currency"> | null
    onSubmit: (values: ProgramPayoutMinimumThresholdValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramPayoutMinimumThresholdForm = ({
    id = "program-payout-minimum-threshold-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramPayoutMinimumThresholdFormProps) => {
    const defaultValues: ProgramPayoutMinimumThresholdFormValues = {
        // stored as minor units; the field shows major units
        payoutMinimumThreshold: fromMinorUnits(program?.payoutMinimumThreshold),
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramPayoutMinimumThreshold },
        onSubmit: ({ value }) => onSubmit(ZProgramPayoutMinimumThreshold.parse(value)),
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
                name="payoutMinimumThreshold"
                children={(field) => (
                    <field.TextField
                        hideLabel
                        prefix={program?.currency ?? "USD"}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 50.00"
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
