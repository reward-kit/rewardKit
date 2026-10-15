import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import {
    ZPartnerPayoutThreshold,
    type PartnerPayoutThresholdFormValues,
    type PartnerPayoutThresholdValues,
} from "@rewardkit/packages/types/partner/partner.validation"
import { fromMinorUnits } from "@rewardkit/lib/amount/money"
import { ProgramResource } from "@rewardkit/packages/types/program/program.schema"

interface PartnerPayoutThresholdFormProps {
    id?: string
    partner?: Pick<PartnerResource, "payoutMinimumThreshold"> | null
    program?: Pick<ProgramResource, "currency"> | null
    onSubmit: (values: PartnerPayoutThresholdValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const PartnerPayoutThresholdForm = ({
    id = "partner-payout-threshold-form",
    partner,
    onSubmit,
    onDirtyChange,
    program,
}: PartnerPayoutThresholdFormProps) => {
    const defaultValues: PartnerPayoutThresholdFormValues = {
        payoutMinimumThreshold: fromMinorUnits(partner?.payoutMinimumThreshold),
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZPartnerPayoutThreshold },
        onSubmit: ({ value }) => onSubmit(ZPartnerPayoutThreshold.parse(value)),
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
                    <field.TextField hideLabel prefix={program?.currency ?? "USD"} type="number" step="0.01" min="0" label="Minimum payout" placeholder="e.g. 50.00" />
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