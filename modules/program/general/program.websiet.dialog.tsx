import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { EditFieldDialog } from '../../../packages/ui/components/input/dialog/text-edit.dialog'
import { getTrpcErrorMessage } from '@rewardkit/lib/trpc/getTRPCError'

export const ProgramWebsiteDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditFieldDialog
            title="Website"
            description="Update the partner program's name."
            label="Website"
            name="website"
            value={program?.websiteUrl}
            isSaving={isUpdating}
            inputProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(websiteUrl) =>
                program?.id && handleUpdate({ programId: program.id, program: { websiteUrl } })
            }
        />
    )
}