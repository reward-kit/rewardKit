import { FormModal } from "@rewardkit/packages/ui/components/modal/form.modal"
import { PayoutMethodForm } from "./payout-method.form"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import toast from "react-hot-toast"

const FORM_ID = "payout-method-form"

interface EditPayoutMethodModalProps {
    partner: PartnerResource
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: "dialog" | "sheet"
}

export const EditPayoutMethodModal = ({ partner, open, onOpenChange, mode }: EditPayoutMethodModalProps) => {
    const { update } = usePartner(partner?.id)

    return (
        <FormModal
            mode={mode}
            open={open}
            onOpenChange={onOpenChange}
            title="Payout method"
            description="Choose how this partner gets paid."
            formId={FORM_ID}
            isPending={update.isPending}
        >
            <PayoutMethodForm
                id={FORM_ID}
                partner={partner}
                onSubmit={(values) => {
                    if (!partner?.id) return toast.error("Partner ID is missing")
                    update.mutate(
                        { partnerId: partner?.id, partnerData: { ...values } },
                        { onSuccess: () => onOpenChange(false) }
                    )
                }
                }
            />
        </FormModal>
    )
}