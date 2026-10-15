import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import { PartnerPayoutThresholdForm } from "./payout-minimum-threshold.form"
import { ProgramResource } from "@rewardkit/packages/types/program/program.schema"

const FORM_ID = "partner-payout-threshold-form"

interface PartnerPayoutThresholdCardProps {
    partner: PartnerResource
    className?: string
    program: ProgramResource
}

export const PartnerPayoutThresholdCard = ({ partner, className, program }: PartnerPayoutThresholdCardProps) => {
    const partnerId = partner?.id ?? partner?._id
    const { update } = usePartner(partnerId)
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Minimum payout"
            description="Payouts are held until this partner's balance reaches this amount."
            footerHint="Leave empty to use the program default"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <PartnerPayoutThresholdForm
                // remount with the saved value so Save greys out again after a successful save
                key={partner.payoutMinimumThreshold ?? "none"}
                id={FORM_ID}
                partner={partner}
                program={program}
                onDirtyChange={setDirty}
                onSubmit={(values) => {
                    if (!partnerId) return toast.error("Partner ID is missing")
                    update.mutate({ partnerId, partnerData: { ...values } })
                }}
            />
        </FormCard>
    )
}