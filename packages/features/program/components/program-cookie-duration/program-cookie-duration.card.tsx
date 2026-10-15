import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramCookieDurationForm } from "./program-cookie-duration.form"

const FORM_ID = "program-cookie-duration-form"

interface ProgramCookieDurationCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramCookieDurationCard = ({ program, className }: ProgramCookieDurationCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Cookie duration"
            description="How long a partner's referral cookie lasts before it expires."
            footerHint="Maximum of 365 days"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramCookieDurationForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.cookieDuration ?? "none"}
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
