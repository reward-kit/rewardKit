import toast from "react-hot-toast"
import React from "react"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import { PARTNER_STATUS, type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import type { PartnerStatusValues, ZPartnerStatus } from "@rewardkit/packages/types/partner/partner.validation"
import { usePartner } from "../../hooks/usePartner"
import { PARTNER_STATUS_STYLE } from "../../contants/status"
import { PartnerStatusForm } from "./partner-status.form"
import z from "zod"
import { isAdminStatus } from "../../lib/status.lib"

const FORM_ID = "partner-status-form"

type StatusFieldValue = z.input<typeof ZPartnerStatus>["status"]

interface PartnerStatusCardProps {
    partner: PartnerResource
    className?: string
}

export const PartnerStatusCard = ({ partner, className }: PartnerStatusCardProps) => {
    const partnerId = partner?.id ?? partner?._id
    const { changeStatus } = usePartner(partnerId)
    const [dirty, setDirty] = React.useState(false)

    // same rule the form uses for its default status
    const savedStatus: StatusFieldValue = isAdminStatus(partner.status) ? partner.status : null
    const [selectedStatus, setSelectedStatus] = React.useState<StatusFieldValue>(savedStatus)

    const hint = selectedStatus ? PARTNER_STATUS_STYLE[selectedStatus].optionSelectionHint : undefined

    return (
        <FormCard
            className={className}
            title="Partner status"
            description="Update the status of this partner."
            footerHint={hint}
            formId={FORM_ID}
            isPending={changeStatus.isPending}
            submitDisabled={!dirty}
            submitLabel="Save"
        >
            <PartnerStatusForm
                key={`${partner.status}-${partner.suspendedReason}-${partner.rejectedReason}`}
                id={FORM_ID}
                partner={partner}
                onDirtyChange={setDirty}
                onStatusChange={setSelectedStatus}
                onSubmit={(values) => {
                    if (!partnerId) return toast.error("Partner ID is missing")
                    changeStatus.mutate({ partnerId, change: { ...values } })
                }}
            />
        </FormCard>
    )
}