import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { EditFieldDialog } from '../../../packages/ui/components/input/dialog/text-edit.dialog'
import { getTrpcErrorMessage } from '@rewardkit/lib/trpc/getTRPCError'

export const ProgramNameDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditFieldDialog
            title="Program name"
            description="Update the partner program's name."
            label="Program name"
            name="name"
            value={program?.name}
            isSaving={isUpdating}
            inputProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(name) =>
                program?.id && handleUpdate({ programId: program.id, program: { name } })
            }
        />
    )
}