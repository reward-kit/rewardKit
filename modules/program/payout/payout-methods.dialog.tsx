import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { PAYOUT_METHOD } from "@rewardkit/packages/types/program/program.schema"
import { EditMultiSelectDialog } from "../../../packages/ui/components/input/dialog/multi-select-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

const PAYOUT_METHOD_OPTIONS = [
    { label: 'PayPal', value: PAYOUT_METHOD.PAYPAL, imageUrl: '/svg/paypal.svg' },
    { label: 'Wise', value: PAYOUT_METHOD.WISE, imageUrl: '/svg/wise.svg' },
] as const

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