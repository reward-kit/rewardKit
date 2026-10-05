import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { CUSTOMER_IDENTITY_VISIBILITY } from '@rewardkit/packages/types/program/program.schema'
import { getTrpcErrorMessage } from '@rewardkit/lib/trpc/getTRPCError'
import { EditRadioDialog } from '@rewardkit/packages/ui/components/input/dialog/radio-edit.dialog'

const VISIBILITY_OPTIONS = [
    {
        label: 'Hide customer details',
        value: CUSTOMER_IDENTITY_VISIBILITY.HIDE,
        description: 'Partners only see that a customer converted.',
    },
    {
        label: 'Email only',
        value: CUSTOMER_IDENTITY_VISIBILITY.EMAIL,
        description: "Partners see the customer's email address.",
    },
    {
        label: 'Name and email',
        value: CUSTOMER_IDENTITY_VISIBILITY.NAME_AND_EMAIL,
        description: "Partners see the customer's name and email address.",
    },
] as const

export const CustomerVisibilityDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditRadioDialog
            title="Customer information visibility"
            description="Choose what partners can see about the customers they refer."
            label="Visibility"
            value={program?.customerIdentifyVisiblity}
            options={VISIBILITY_OPTIONS}
            isSaving={isUpdating}
            radioProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(customerIdentifyVisiblity) =>
                program?.id &&
                handleUpdate({ programId: program.id, program: { customerIdentifyVisiblity } })
            }
        />
    )
}