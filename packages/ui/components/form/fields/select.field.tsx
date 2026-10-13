import { SelectInput } from "@rewardkit/packages/ui/components/input/select.input"
import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"

type SelectFieldProps = Omit<
    React.ComponentProps<typeof SelectInput>,
    "value" | "onChange" | "onBlur" | "isError" | "errorMessage"
>

export const SelectField = (props: SelectFieldProps) => {
    const field = useFieldContext<string>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <SelectInput
            {...props}
            value={field.state.value}
            onChange={(value) => {
                field.handleChange(value ?? "")
                field.handleBlur()
            }}
            onBlur={field.handleBlur}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}