import { FormModal } from "@rewardkit/packages/ui/components/modal/form.modal"
import { PartnerStatusForm } from "./partner-status.form"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { usePartner } from "../../hooks/usePartner"
import toast from "react-hot-toast"

const FORM_ID = "payout-method-form"

interface EditPartnerStatusModalProps {
    partner: PartnerResource
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: "dialog" | "sheet"
}

export const EditPartnerStatusModal = ({ partner, open, onOpenChange, mode }: EditPartnerStatusModalProps) => {
    const partnerId = partner?.id ?? partner?._id
    const { changeStatus } = usePartner()
    return (
        <FormModal
            mode={mode}
            open={open}
            onOpenChange={onOpenChange}
            title="Partner status"
            description="Update partner status"
            formId={FORM_ID}
            isPending={changeStatus.isPending}
            submitLabel="Update status"
        >
            <PartnerStatusForm
                id={FORM_ID}
                partner={partner}
                onSubmit={(values) => {
                    if (!partnerId) return toast.error("Partner ID is missing")
                    changeStatus.mutate(
                        { partnerId, change: { ...values } },
                        { onSuccess: () => onOpenChange(false) }
                    )
                }}
            />
        </FormModal>
    )
}