import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramNameForm } from "./program-name.form"

const FORM_ID = "program-name-form"

interface ProgramNameCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramNameCard = ({ program, className }: ProgramNameCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Partner program name"
            description="The partner program's name."
            footerHint="Maximum of 100 characters"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramNameForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.name}
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
