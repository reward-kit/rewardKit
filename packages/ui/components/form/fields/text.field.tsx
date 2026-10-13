import { TextInput } from "@rewardkit/packages/ui/components/input/text.input"
import { useFieldContext } from "../form-context"

type TextFieldProps = Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange" | "onBlur" | "name" | "isError" | "errorMessage">

export const TextField = (props: TextFieldProps) => {
    const field = useFieldContext<string>()
    const { isTouched, isValid, errors } = field.state.meta
    const showError = isTouched && !isValid

    const errorMessage = errors
        .map((e) => (typeof e === "string" ? e : e?.message))
        .filter(Boolean)
        .join(", ")

    return (
        <TextInput
            {...props}
            name={field.name}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            onBlur={field.handleBlur}
            isError={showError}
            errorMessage={showError ? errorMessage : undefined}
        />
    )
}