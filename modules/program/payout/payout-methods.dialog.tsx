import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditMultiSelectDialog } from "../../../packages/ui/components/input/dialog/multi-select-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"
import { PAYOUT_METHOD_OPTIONS } from "@rewardkit/packages/features/payouts/constant"

export const ProgramPayoutMethodDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditMultiSelectDialog
            title="Payout methods"
            description="Partners can choose from these methods when they get paid."
            label="Payout methods"
            value={program?.payoutMethods}
            selectProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            options={PAYOUT_METHOD_OPTIONS}
            isSaving={isUpdating}
            onSave={(payoutMethods) =>
                program?.id && handleUpdate({ programId: program.id, program: { payoutMethods } })
            }
        />
    )
}