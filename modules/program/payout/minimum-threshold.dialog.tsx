import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditAmountDialog } from "../../../packages/ui/components/input/dialog/amount-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

export const ProgramPayoutThresholdDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditAmountDialog
            title="Minimum payout"
            description="Partners are paid once their balance reaches this amount."
            label="Minimum payout threshold"
            inputProps={{ prefix: program?.currency ?? "USD", isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            value={program?.payoutMinimumThreshold}
            requirePositive={false}
            isSaving={isUpdating}
            onSave={(payoutMinimumThreshold) =>
                program?.id && handleUpdate({ programId: program.id, program: { payoutMinimumThreshold } })
            }
        />
    )
}