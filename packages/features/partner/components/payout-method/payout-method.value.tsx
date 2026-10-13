import React from "react"
import { Small } from "@rewardkit/packages/ui/components/typography"
import { PAYOUT_METHOD_OPTIONS } from "@rewardkit/packages/features/payouts/constant"
import type { PartnerResource } from "@rewardkit/packages/types/partner/partner.schema"
import { Image } from "@rewardkit/packages/ui/components/image"
import { AppCopyTooltip } from "@rewardkit/packages/ui/components/tooltip/tooltip"

interface PayoutMethodValueProps {
    partner?: Pick<PartnerResource, "payoutMethod" | "payoutDetails"> | null
}

export const PayoutMethodValue = ({ partner }: PayoutMethodValueProps) => {
    if (!partner?.payoutMethod) return <span>-</span>

    const label = PAYOUT_METHOD_OPTIONS.find((o) => o.value === partner.payoutMethod)?.label ?? partner.payoutMethod

    return (
        <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
                <Small className="text-xs text-foreground italic">{label}</Small>
            </div>
            {partner.payoutDetails?.email && (
                <AppCopyTooltip copyValue={partner.payoutDetails?.email}>
                    <Small className="text-foreground italic text-xs">{partner.payoutDetails.email}</Small>
                </AppCopyTooltip>
            )}
        </div>
    )
}