import { useFieldContext } from "../form-context"
import { getErrorMessage } from "../error"
import { CommandAvatarInput } from "../../input/command.avatar.input"

type CommandAvatarFieldProps = Omit<
    React.ComponentProps<typeof CommandAvatarInput>,
    "value" | "onChange" | "onBlur" | "isError" | "errorMessage"
>

export const CommandAvatarField = (props: CommandAvatarFieldProps) => {
    const field = useFieldContext<string>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    return (
        <CommandAvatarInput
            {...props}
            value={field.state.value ?? ""}
            onChange={(value) => {
                field.handleChange(value)
                field.handleBlur()
            }}
            onBlur={field.handleBlur}
            isError={showError}
            errorMessage={showError ? getErrorMessage(errors) : undefined}
        />
    )
}