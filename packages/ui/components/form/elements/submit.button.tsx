import { Button } from "@rewardkit/packages/ui/components/button"
import { useFormContext } from "../form-context"

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "type" | "onClick"> & {
    label?: string
}

export const SubmitButton = ({ label = "Submit", children, disabled, ...props }: SubmitButtonProps) => {
    const form = useFormContext()

    return (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={disabled || !canSubmit || isSubmitting} {...props}>
                    {children ?? label}
                </Button>
            )}
        </form.Subscribe>
    )
}