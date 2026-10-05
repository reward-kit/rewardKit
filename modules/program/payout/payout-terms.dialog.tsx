import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditSelectDialog } from "../../../packages/ui/components/input/dialog/select-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

const PAYOUT_TERM_OPTIONS = [
    { label: 'NET 15', value: "15" },
    { label: 'NET 30', value: "30" },
    { label: 'NET 45', value: "45" },
    { label: 'NET 60', value: "60" },
]

export const ProgramPayoutTermsDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditSelectDialog
            title="Payout terms"
            description="Update the program's payout term."
            label="Payout terms"
            value={String(program?.payoutTerm)}
            selectProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            options={PAYOUT_TERM_OPTIONS}
            isSaving={isUpdating}
            onSave={(term) =>
                program?.id &&
                handleUpdate({
                    programId: program.id,
                    program: { payoutTerm: Number(term) as 15 | 30 | 45 | 60 },
                })
            } />
    )
}