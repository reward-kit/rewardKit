import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { EditFieldDialog } from '../../../packages/ui/components/input/dialog/text-edit.dialog'
import { getTrpcErrorMessage } from '@rewardkit/lib/trpc/getTRPCError'

export const CookieDurationEditDialog = () => {
    const { program, update, handleUpdate, isUpdating } = useProgram()

    return (
        <EditFieldDialog
            title="Cookie duration"
            description="Set the cookie duration. The maximum allowed duration is 365 days."
            label="Cookie duration"
            name="duration"
            value={String(program?.cookieDuration)}
            isSaving={isUpdating}
            inputProps={{ suffix: "days", type: "number", inputMode: "numeric", isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(cookieDuration) =>
                program?.id && handleUpdate({ programId: program.id, program: { cookieDuration: Number(cookieDuration) } })
            }
        />
    )
}