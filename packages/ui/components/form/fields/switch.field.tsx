import { SwitchInput } from "@rewardkit/packages/ui/components/input/switch.input"
import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"

type SwitchFieldProps = Omit<
    React.ComponentProps<typeof SwitchInput>,
    "checked" | "defaultChecked" | "onChange" | "isError" | "errorMessage"
>

export const SwitchField = (props: SwitchFieldProps) => {
    const field = useFieldContext<boolean>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <SwitchInput
            {...props}
            checked={field.state.value}
            onChange={(checked) => {
                field.handleChange(checked)
                field.handleBlur()
            }}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}
