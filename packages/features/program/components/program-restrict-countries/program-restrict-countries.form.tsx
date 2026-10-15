import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import { ALL_COUNTRIES_WITH_FLAGS } from "@rewardkit/lib/countries"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramRestrictCountries,
    type ProgramRestrictCountriesFormValues,
    type ProgramRestrictCountriesValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramRestrictCountriesFormProps {
    id?: string
    program?: Pick<ProgramResource, "restrictCountries"> | null
    onSubmit: (values: ProgramRestrictCountriesValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramRestrictCountriesForm = ({
    id = "program-restrict-countries-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramRestrictCountriesFormProps) => {
    const defaultValues: ProgramRestrictCountriesFormValues = {
        restrictCountries: program?.restrictCountries ?? [],
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramRestrictCountries },
        onSubmit: ({ value }) => onSubmit(ZProgramRestrictCountries.parse(value)),
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
                name="restrictCountries"
                children={(field) => (
                    <field.MultiSelectField
                        placeholder="Select countries"
                        searchPlaceholder="Search countries..."
                        options={ALL_COUNTRIES_WITH_FLAGS}
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
