import { FormModal } from "@rewardkit/packages/ui/components/modal/form.modal"
import type { UrlParameter } from "@rewardkit/packages/types/program/program.schema"
import { usePartnerLinks } from "../../hooks/usePartnerLinks"
import { LinkCreateForm } from "./link-create.form"

const FORM_ID = "create-link-form"

interface LinkCreateModalProps {
    partnerId: string
    urlParams?: UrlParameter[] | null
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: "dialog" | "sheet"
    websiteUrl?: string
}

export const LinkCreateModal = ({ partnerId, urlParams, websiteUrl, open, onOpenChange, mode }: LinkCreateModalProps) => {
    // mutations only, so no list query runs for the modal
    const { handleCreate, isCreating } = usePartnerLinks({ partnerId, enabled: false })

    return (
        <FormModal
            mode={mode}
            open={open}
            // don't let the modal close mid-request
            onOpenChange={(next) => {
                if (!next && isCreating) return
                onOpenChange(next)
            }}
            title="Create link"
            description="Create a tracking link on behalf of this partner. Leave the code empty and we'll generate one from their name."
            formId={FORM_ID}
            isPending={isCreating}
            className="sm:max-w-md"
            submitLabel="Create link"
        >
            <LinkCreateForm
                id={FORM_ID}
                urlParams={urlParams}
                websiteUrl={websiteUrl}
                onSubmit={async (linkData) => {
                    // the hook toasts success and failure, so only the result matters here
                    if (await handleCreate(linkData)) onOpenChange(false)
                }}
            />
        </FormModal>
    )
}