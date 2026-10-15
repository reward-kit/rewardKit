import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { buildCurrencyOptions } from "@rewardkit/lib/amount/currency"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramCurrency,
    type ProgramCurrencyFormValues,
    type ProgramCurrencyValues,
} from "@rewardkit/packages/types/program/program.validator"

const CURRENCY_OPTIONS = buildCurrencyOptions()

interface ProgramCurrencyFormProps {
    id?: string
    program?: Pick<ProgramResource, "currency"> | null
    onSubmit: (values: ProgramCurrencyValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramCurrencyForm = ({
    id = "program-currency-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramCurrencyFormProps) => {
    const defaultValues: ProgramCurrencyFormValues = {
        currency: program?.currency ?? "USD",
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramCurrency },
        onSubmit: ({ value }) => onSubmit(ZProgramCurrency.parse(value)),
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
                name="currency"
                children={(field) => (
                    <field.CommandAvatarField
                        placeholder="Select a currency"
                        options={CURRENCY_OPTIONS}
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
