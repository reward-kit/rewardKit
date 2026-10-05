import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { EditFieldDialog } from '../../../packages/ui/components/input/dialog/text-edit.dialog'
import { getTrpcErrorMessage } from '@rewardkit/lib/trpc/getTRPCError'

export const ProgramProductNameDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditFieldDialog
            title="Product name"
            description="Update the partner program's name."
            label="Product name"
            name="product-name"
            value={program?.productName}
            inputProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            isSaving={isUpdating}
            onSave={(productName) =>
                program?.id && handleUpdate({ programId: program.id, program: { productName } })
            }
        />
    )
}