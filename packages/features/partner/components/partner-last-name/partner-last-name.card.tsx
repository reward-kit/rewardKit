import { useState } from "react"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import { PartnerLastNameForm } from "./partner-last-name.form"

const FORM_ID = "partner-last-name-form"

interface PartnerLastNameCardProps {
    partner: PartnerResource
    className?: string
}

export const PartnerLastNameCard = ({ partner, className }: PartnerLastNameCardProps) => {
    const { handleUpdate, isUpdating } = usePartner()
    const [dirty, setDirty] = useState(false)
    const initialValue = partner.lastName ?? ""

    return (
        <FormCard
            className={className}
            title="Last name"
            description="The last name of this partner."
            footerHint="Maximum of 30 characters"
            formId={FORM_ID}
            isPending={isUpdating}
            submitDisabled={!dirty}
        >
            <PartnerLastNameForm
                key={initialValue}
                id={FORM_ID}
                initialValue={initialValue}
                onDirtyChange={setDirty}
                onSubmit={async ({ lastName }) => {
                    const ok = await handleUpdate({
                        partnerId: partner.id ?? partner._id ?? "",
                        partnerData: { lastName },
                    })
                    if (ok) setDirty(false)
                }}
            />
        </FormCard>
    )
}