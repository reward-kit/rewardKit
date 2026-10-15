import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramRestrictCountriesForm } from "./program-restrict-countries.form"

const FORM_ID = "program-restrict-countries-form"

interface ProgramRestrictCountriesCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramRestrictCountriesCard = ({ program, className }: ProgramRestrictCountriesCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Block partners from these countries"
            description="Partners from these countries can't join your program."
            footerHint="Leave empty to allow every country"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramRestrictCountriesForm
                // remount with the saved values so Save greys out again after a successful save
                key={(program.restrictCountries ?? []).join("-")}
                id={FORM_ID}
                program={program}
                onDirtyChange={setDirty}
                onSubmit={(values) => {
                    if (!programId) return toast.error("Program ID is missing")
                    update.mutate({ programId, programData: values })
                }}
            />
        </FormCard>
    )
}
