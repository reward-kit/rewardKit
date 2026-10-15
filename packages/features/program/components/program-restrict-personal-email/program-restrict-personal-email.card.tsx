import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramRestrictPersonalEmailForm } from "./program-restrict-personal-email.form"

const FORM_ID = "program-restrict-personal-email-form"

interface ProgramRestrictPersonalEmailCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramRestrictPersonalEmailCard = ({ program, className }: ProgramRestrictPersonalEmailCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Block personal email registration by partner"
            description="Only allow partners to register with a business email address."
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramRestrictPersonalEmailForm
                // remount with the saved value so Save greys out again after a successful save
                key={`${program.restrictPersonalEmail ?? false}`}
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
