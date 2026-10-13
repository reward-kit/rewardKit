import toast from "react-hot-toast"
import { FormModal } from "@rewardkit/packages/ui/components/modal/form.modal"
import { usePartner } from "../../hooks/usePartner"
import { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { PartnerCreateForm } from "./create-partner.form"

const FORM_ID = "create-partner-form"

interface CreatePartnerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: "dialog" | "sheet"
}

export const CreatePartnerModal = ({ open, onOpenChange, mode }: CreatePartnerModalProps) => {
    const { handleCreate, isCreating } = usePartner()

    return (
        <FormModal
            mode={mode}
            open={open}
            // don't let the modal close mid-request
            onOpenChange={(next) => {
                if (!next && isCreating) return
                onOpenChange(next)
            }}
            title="Create partner"
            description="Add a partner to your program."
            formId={FORM_ID}
            isPending={isCreating}
            className="sm:max-w-xl"
            submitLabel="Create partner"
        >
            <PartnerCreateForm
                id={FORM_ID}
                onSubmit={async (partner) => {
                    // the hook toasts success and failure, so only the result matters here
                    if (await handleCreate({ partner })) onOpenChange(false)
                }}
            />
        </FormModal>
    )
}