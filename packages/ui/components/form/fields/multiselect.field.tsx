import { MultiSelectInput } from "@rewardkit/packages/ui/components/input/multi-select.input"
import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"

type MultiSelectFieldProps = Omit<
    React.ComponentProps<typeof MultiSelectInput>,
    "value" | "onChange" | "isError" | "errorMessage"
>

export const MultiSelectField = (props: MultiSelectFieldProps) => {
    const field = useFieldContext<string[]>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <MultiSelectInput
            {...props}
            value={field.state.value ?? []}
            onChange={(value) => {
                field.handleChange(value)
                field.handleBlur()
            }}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}
