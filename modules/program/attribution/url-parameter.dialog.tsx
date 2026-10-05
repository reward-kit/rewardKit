import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditSelectDialog } from "../../../packages/ui/components/input/dialog/select-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"
import { URL_PARAMETER } from "@rewardkit/packages/types/program/program.schema"
import { EditMultiSelectDialog } from "@rewardkit/packages/ui/components/input/dialog/multi-select-edit.dialog"

const URL_PARAMETER_OPTIONS = [
    { label: '?ref=', value: URL_PARAMETER.REF },
    { label: '?via=', value: URL_PARAMETER.VIA },
    { label: '?aff=', value: URL_PARAMETER.AFF },
]

export const URLParameterDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditMultiSelectDialog
            title="URL parameters"
            description="Update the program's url parameter."
            label="URL parameters"
            value={program?.urlParams}
            selectProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            options={URL_PARAMETER_OPTIONS}
            isSaving={isUpdating}
            onSave={(urlParams) =>
                program?.id &&
                handleUpdate({
                    programId: program.id,
                    program: { urlParams: urlParams },
                })
            } />
    )
}