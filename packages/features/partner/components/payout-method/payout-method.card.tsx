import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import { PayoutMethodForm } from "./payout-method.form"

const FORM_ID = "payout-method-form"

interface PayoutMethodCardProps {
    partner: PartnerResource
    className?: string
}

export const PayoutMethodCard = ({ partner, className }: PayoutMethodCardProps) => {
    const partnerId = partner?.id ?? partner?._id
    const { update } = usePartner()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Payout method"
            description="Choose how this partner gets paid."
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
            submitLabel="Save"
        >
            <PayoutMethodForm
                // remount with the saved values so Save greys out again after a successful save
                key={`${partner.payoutMethod}-${partner.payoutDetails?.email}`}
                id={FORM_ID}
                partner={partner}
                onDirtyChange={setDirty}
                onSubmit={(values) => {
                    if (!partnerId) return toast.error("Partner ID is missing")
                    update.mutate({ partnerId, partnerData: { ...values } })
                }}
            />
        </FormCard>
    )
}