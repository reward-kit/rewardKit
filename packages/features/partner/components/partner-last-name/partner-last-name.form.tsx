import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { z } from "zod"

const schema = z.object({
    lastName: z.string().trim().min(1, "Last name is required").max(30, "Maximum of 30 characters"),
})

export type PartnerLastNameValues = z.output<typeof schema>

interface PartnerLastNameFormProps {
    id: string
    initialValue: string
    onSubmit: (values: PartnerLastNameValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const PartnerLastNameForm = ({ id, initialValue, onSubmit, onDirtyChange }: PartnerLastNameFormProps) => {
    const form = useAppForm({
        defaultValues: { lastName: initialValue },
        validators: {
            onChange: ({ value }) => {
                const result = schema.safeParse(value)
                if (result.success) return undefined
                return { fields: { lastName: result.error.issues[0].message } }
            },
        },
        onSubmit: ({ value }) => onSubmit(schema.parse(value)),
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
                name="lastName"
                listeners={{
                    onChange: ({ value }) => onDirtyChange?.(value.trim() !== initialValue.trim()),
                }}
                children={(field) => (
                    <field.TextField label="Last name" hideLabel placeholder="Doe" />
                )}
            />
        </form>
    )
}