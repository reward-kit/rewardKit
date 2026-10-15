import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramProductName,
    type ProgramProductNameFormValues,
    type ProgramProductNameValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramProductNameFormProps {
    id?: string
    program?: Pick<ProgramResource, "productName"> | null
    onSubmit: (values: ProgramProductNameValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramProductNameForm = ({
    id = "program-product-name-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramProductNameFormProps) => {
    const defaultValues: ProgramProductNameFormValues = {
        productName: program?.productName ?? "",
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramProductName },
        onSubmit: ({ value }) => onSubmit(ZProgramProductName.parse(value)),
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
                name="productName"
                children={(field) => (
                    <field.TextField hideLabel placeholder="e.g. Acme" />
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
