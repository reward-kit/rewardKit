"use client"

import { useState } from "react"
import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditFieldDialog } from "@rewardkit/packages/ui/components/input/dialog/text-edit.dialog"
import type { PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

export const GroupPayoutDialog = ({ group }: { group: PartnerGroupsResource }) => {
    const { program } = useProgram()
    const { handleUpdate, isUpdating, update } = usePartnerGroups()
    const [error, setError] = useState<string | undefined>()

    return (
        <EditFieldDialog
            title="Minimum payout"
            description="Partners in this group are paid once their balance reaches this amount."
            label="Minimum payout"
            name="payout"
            value={group.payoutMinimumThreshold != null ? String(group.payoutMinimumThreshold) : ""}
            isSaving={isUpdating}
            inputProps={{
                prefix: program?.currency ?? "USD",
                inputMode: "decimal",
                isError: !!error || update.isError,
                errorMessage: error ?? getTrpcErrorMessage(update.error),
            }}
            onSave={(raw) => {
                const value = raw.trim()
                const payout = value === "" ? NaN : Number(value)
                if (Number.isNaN(payout) || payout < 0) {
                    setError("Enter a valid amount")
                    return null // keep the dialog open
                }
                setError(undefined)
                return group.id
                    ? handleUpdate({ partnerGroupId: group.id, groupData: { payoutMinimumThreshold: payout } })
                    : null
            }}
        />
    )
}
