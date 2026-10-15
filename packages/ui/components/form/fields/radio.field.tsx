import { RadioInput, type RadioOption } from "@rewardkit/packages/ui/components/input/radio.input"
import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"

type RadioFieldProps = {
    label?: string
    required?: boolean
    options: readonly RadioOption<string>[]
    disabled?: boolean
    parentClassName?: string
}

export const RadioField = (props: RadioFieldProps) => {
    const field = useFieldContext<string>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <RadioInput<string>
            {...props}
            value={field.state.value ?? null}
            onChange={(value) => {
                field.handleChange(value)
                field.handleBlur()
            }}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}
