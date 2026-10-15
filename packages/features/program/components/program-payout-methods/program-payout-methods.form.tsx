import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { PAYOUT_METHOD_OPTIONS } from "@rewardkit/packages/features/payouts/constant"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramPayoutMethods,
    type ProgramPayoutMethodsFormValues,
    type ProgramPayoutMethodsValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramPayoutMethodsFormProps {
    id?: string
    program?: Pick<ProgramResource, "payoutMethods"> | null
    onSubmit: (values: ProgramPayoutMethodsValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramPayoutMethodsForm = ({
    id = "program-payout-methods-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramPayoutMethodsFormProps) => {
    const defaultValues: ProgramPayoutMethodsFormValues = {
        payoutMethods: program?.payoutMethods ?? [],
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramPayoutMethods },
        onSubmit: ({ value }) => onSubmit(ZProgramPayoutMethods.parse(value)),
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
                name="payoutMethods"
                children={(field) => (
                    <field.MultiSelectField
                        placeholder="Select payout methods"
                        options={PAYOUT_METHOD_OPTIONS}
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
