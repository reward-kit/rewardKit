import { TextareaInput } from "@rewardkit/packages/ui/components/input/textarea.input"
import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"

type TextareaFieldProps = Omit<
    React.ComponentProps<typeof TextareaInput>,
    "value" | "onChange" | "onBlur" | "isError" | "errorMessage"
>

export const TextareaField = (props: TextareaFieldProps) => {
    const field = useFieldContext<string>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <TextareaInput
            {...props}
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(value) => field.handleChange(value)}
            onBlur={field.handleBlur}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}