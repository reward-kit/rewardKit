import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { z } from "zod"

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(30, "Maximum of 30 characters"),
})

export type PartnerFirstNameValues = z.output<typeof schema>

interface PartnerFirstNameFormProps {
  id: string
  initialValue: string
  onSubmit: (values: PartnerFirstNameValues) => void
  /** Lets the modal disable Save until the value actually changes. */
  onDirtyChange?: (dirty: boolean) => void
}

export const PartnerFirstNameForm = ({ id, initialValue, onSubmit, onDirtyChange }: PartnerFirstNameFormProps) => {
  const form = useAppForm({
    defaultValues: { firstName: initialValue },
    validators: {
      onChange: ({ value }) => {
        const result = schema.safeParse(value)
        if (result.success) return undefined
        return { fields: { firstName: result.error.issues[0].message } }
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
        name="firstName"
        listeners={{
          onChange: ({ value }) => onDirtyChange?.(value.trim() !== initialValue.trim()),
        }}
        children={(field) => (
          <field.TextField label="First name" hideLabel placeholder="Jane" />
        )}
      />
    </form>
  )
}