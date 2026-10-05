import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { buildCurrencyOptions } from "@rewardkit/lib/amount/currency"
import { EditCommandAvatarDialog } from "../../../packages/ui/components/input/dialog/command-avatar-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

const CURRENCY_OPTIONS = buildCurrencyOptions()

export const ProgramCurrencyDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditCommandAvatarDialog
            title="Update program currency"
            description="Update the program's currency. NOTE: Only new data will be converted to the new currency."
            label="Program Currency"
            value={program?.currency}
            options={CURRENCY_OPTIONS}
            isSaving={isUpdating}
            inputProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(currency) =>
                program?.id && handleUpdate({ programId: program.id, program: { currency } })
            }
        />
    )
}