import { useState } from "react"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import { PartnerFirstNameForm } from "./partner-first-name.form"

const FORM_ID = "partner-first-name-form"

interface PartnerFirstNameCardProps {
    partner: PartnerResource
    className?: string
}

export const PartnerFirstNameCard = ({ partner, className }: PartnerFirstNameCardProps) => {
    const { handleUpdate, isUpdating } = usePartner()
    const [dirty, setDirty] = useState(false)
    const initialValue = partner.firstName ?? ""

    return (
        <FormCard
            className={className}
            title="First name"
            description="The first name of this partner."
            footerHint="Maximum of 30 characters"
            formId={FORM_ID}
            isPending={isUpdating}
            submitDisabled={!dirty}
        >
            <PartnerFirstNameForm
                // remount with the new saved value so "dirty" starts clean again
                key={initialValue}
                id={FORM_ID}
                initialValue={initialValue}
                onDirtyChange={setDirty}
                onSubmit={async ({ firstName }) => {
                    const ok = await handleUpdate({
                        partnerId: partner.id ?? partner._id ?? "",
                        partnerData: { firstName },
                    })
                    if (ok) setDirty(false)
                }}
            />
        </FormCard>
    )
}