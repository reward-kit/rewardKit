import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import { ZCreatePartnerInput } from "@rewardkit/packages/types/partner/partner.api.schema"
import { PAYOUT_METHOD } from "@rewardkit/packages/types/payout/payout.schema"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"
import { PAYOUT_METHOD_OPTIONS } from "@rewardkit/packages/features/payouts/constant"
import { ALL_COUNTRIES_WITH_FLAGS } from "@rewardkit/lib/countries"
import { toOptionalString } from "@rewardkit/hooks/useForm"
import { CommandAvatarInput } from "@rewardkit/packages/ui/components/input/command.avatar.input"
import type { z } from "zod"

const partnerSchema = ZCreatePartnerInput.shape.partnerData
export type PartnerCreateValues = z.output<typeof partnerSchema>

type FormValues = {
    firstName: string
    lastName: string
    companyName: string
    email: string
    countryCode: string
    groupId: string
    payoutMethod: (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD] | null
    payoutDetails: { email: string }
    status: typeof PARTNER_STATUS.ACTIVE
}

const defaultValues: FormValues = {
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    countryCode: "",
    groupId: "",
    payoutMethod: null,
    payoutDetails: { email: "" },
    status: PARTNER_STATUS.ACTIVE,
}

// raw form values -> API input (same mapping the old toInput did)
const toInput = (v: FormValues) => ({
    firstName: v.firstName.trim(),
    lastName: v.lastName.trim(),
    companyName: toOptionalString(v.companyName),
    email: v.email.trim(),
    countryCode: v.countryCode.trim().toUpperCase(),
    groupId: toOptionalString(v.groupId),
    status: v.status,
    payoutMethod: v.payoutMethod || null,
    payoutDetails: v.payoutMethod ? { email: v.payoutDetails.email.trim().toLowerCase() } : null,
})

// run the API schema on the mapped input and turn zod issues into per-field errors
const validate = ({ value }: { value: FormValues }) => {
    const result = partnerSchema.safeParse(toInput(value))
    if (result.success) return undefined
    const fields: Record<string, string> = {}
    for (const issue of result.error.issues) {
        const key = issue.path.join(".")
        fields[key] ??= issue.message
    }
    return { fields }
}

interface PartnerCreateFormProps {
    id: string
    onSubmit: (values: PartnerCreateValues) => void
}

export const PartnerCreateForm = ({ id, onSubmit }: PartnerCreateFormProps) => {
    const { partnerGroups } = usePartnerGroups()

    const groupOptions = partnerGroups.map((group) => ({
        label: group.name,
        value: group.id ?? group._id ?? "",
    }))

    const form = useAppForm({
        defaultValues,
        validators: { onChange: validate },
        onSubmit: ({ value }) => {
            onSubmit(partnerSchema.parse(toInput(value)))
        },
    })

    return (
        <form
            id={id}
            noValidate
            className="flex flex-col gap-5"
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <div className="grid grid-cols-2 gap-2">
                <form.AppField name="firstName" children={(field) => (
                    <field.TextField label="First name" placeholder="Jane" />
                )} />
                <form.AppField name="lastName" children={(field) => (
                    <field.TextField label="Last name" placeholder="Doe" />
                )} />
            </div>

            <form.AppField name="email" children={(field) => (
                <field.TextField type="email" label="Email" placeholder="jane@example.com" />
            )} />

            <form.AppField name="companyName" children={(field) => (
                <field.TextField label="Company name (Optional)" placeholder="Acme Inc." />
            )} />
            
            <form.AppField name="countryCode" children={(field) => (
                <CommandAvatarInput
                    label="Country"
                    required
                    placeholder="Select country"
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v ?? "")}
                    options={ALL_COUNTRIES_WITH_FLAGS}
                    isError={field.state.meta.isTouched && !field.state.meta.isValid}
                    errorMessage={field.state.meta.errors.map(String).join(", ")}
                />
            )} />


            <form.AppField name="groupId" children={(field) => (
                <field.SelectField
                    label="Group (Optional)"
                    placeholder="Select group"
                    options={groupOptions}
                />
            )} />

            <form.AppField
                name="payoutMethod"
                listeners={{ onChange: () => form.setFieldValue("payoutDetails", { email: "" }) }}
                children={(field) => (
                    <field.SelectField
                        label="Payout method (Optional)"
                        placeholder="Select payout method"
                        options={PAYOUT_METHOD_OPTIONS}
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.values.payoutMethod}>
                {(method) =>
                    method ? (
                        <form.AppField name="payoutDetails.email" children={(field) => (
                            <field.TextField type="email" label="Payout email" placeholder="payouts@example.com" />
                        )} />
                    ) : null
                }
            </form.Subscribe>
        </form>
    )
}