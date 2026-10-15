import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import {
    CUSTOMER_IDENTITY_VISIBILITY,
    type ProgramResource,
} from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramCustomerVisibility,
    type ProgramCustomerVisibilityFormValues,
    type ProgramCustomerVisibilityValues,
} from "@rewardkit/packages/types/program/program.validator"

export const VISIBILITY_OPTIONS = [
    {
        label: "Hide customer details",
        value: CUSTOMER_IDENTITY_VISIBILITY.HIDE,
        description: "Partners only see that a customer converted.",
    },
    {
        label: "Email only",
        value: CUSTOMER_IDENTITY_VISIBILITY.EMAIL,
        description: "Partners see the customer's email address.",
    },
    {
        label: "Name and email",
        value: CUSTOMER_IDENTITY_VISIBILITY.NAME_AND_EMAIL,
        description: "Partners see the customer's name and email address.",
    },
]

interface ProgramCustomerVisibilityFormProps {
    id?: string
    program?: Pick<ProgramResource, "customerIdentifyVisiblity"> | null
    onSubmit: (values: ProgramCustomerVisibilityValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramCustomerVisibilityForm = ({
    id = "program-customer-visibility-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramCustomerVisibilityFormProps) => {
    const defaultValues: ProgramCustomerVisibilityFormValues = {
        customerIdentifyVisiblity:
            program?.customerIdentifyVisiblity ?? CUSTOMER_IDENTITY_VISIBILITY.HIDE,
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramCustomerVisibility },
        onSubmit: ({ value }) => onSubmit(ZProgramCustomerVisibility.parse(value)),
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
                name="customerIdentifyVisiblity"
                children={(field) => (
                    <field.RadioField options={VISIBILITY_OPTIONS} />
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
