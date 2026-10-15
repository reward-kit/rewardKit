import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramUrlParamsForm } from "./program-url-params.form"

const FORM_ID = "program-url-params-form"

interface ProgramUrlParamsCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramUrlParamsCard = ({ program, className }: ProgramUrlParamsCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="URL parameters"
            description="The URL parameters partners can use in their tracking links."
            footerHint="Select at least one parameter"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramUrlParamsForm
                // remount with the saved values so Save greys out again after a successful save
                key={(program.urlParams ?? []).join("-")}
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
