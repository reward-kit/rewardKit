import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { EditMultiSelectDialog } from "../../../packages/ui/components/input/dialog/multi-select-edit.dialog"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"
import { ALL_COUNTRIES } from "@rewardkit/lib/countries"

export const RestrictedCountriesDialog = () => {
    const { program, handleUpdate, update, isUpdating } = useProgram()

    return (
        <EditMultiSelectDialog
            title="Restricted countries"
            description="Partners from these countries can't join your program."
            label="Restricted countries"
            value={program?.restrictCountries}
            options={ALL_COUNTRIES}
            allowEmpty
            isSaving={isUpdating}
            selectProps={{ isError: update.isError, errorMessage: getTrpcErrorMessage(update.error) }}
            onSave={(restrictCountries) =>
                program?.id && handleUpdate({ programId: program.id, program: { restrictCountries } })
            }
        />
    )
}