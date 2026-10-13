import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema";
import { SelectOption } from "@rewardkit/packages/ui/components/input/select.input";
import { PartnerStatusBadge } from "@rewardkit/packages/ui/components/status/partner.status";


export type PartnerStatus = "active" | "pending" | "invited" | "suspended" | "rejected"

type StatusStyle = {
    label: string
    dot: string
    className: string
    /** Describes the partner's current state */
    hint: string
    /** Describes what will happen if the admin selects this status */
    optionSelectionHint?: string
}

export const PARTNER_STATUS_STYLE: Record<PartnerStatus, StatusStyle> = {
    active: {
        label: "Active",
        dot: "bg-emerald-500",
        className: "bg-primary! text-foreground",
        hint: "This partner is approved and can earn commissions.",
        optionSelectionHint: "Active the partner so they can earn commissions again.",
    },
    pending: {
        label: "Pending",
        dot: "bg-amber-500",
        className: "",
        hint: "This partner's application is waiting for your review.",
    },
    invited: {
        label: "Invited",
        dot: "bg-sky-500",
        className: "",
        hint: "An invitation was sent. The partner hasn't accepted it yet.",
    },
    suspended: {
        label: "Suspended",
        dot: "bg-orange-500",
        className: "",
        hint: "This partner is temporarily paused and won't earn new commissions.",
        optionSelectionHint: "Pauses the partner. They won't earn new commissions until you reactivate them.",
    },
    rejected: {
        label: "Rejected",
        dot: "bg-red-500",
        className: "",
        hint: "This partner's application was declined.",
        optionSelectionHint: "Declines the partner's application. They won't be able to earn commissions.",
    },
}

export const PARTNER_STATUS_OPTIONS: SelectOption[] = [
    PARTNER_STATUS.ACTIVE,
    PARTNER_STATUS.SUSPENDED,
    PARTNER_STATUS.REJECTED,
].map((status) => ({
    label: PARTNER_STATUS_STYLE[status].label,
    value: status,
    custom: <PartnerStatusBadge variant="dot" status={status} />,
}))