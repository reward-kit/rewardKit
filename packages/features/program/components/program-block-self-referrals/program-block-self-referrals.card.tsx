import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramBlockSelfReferralsForm } from "./program-block-self-referrals.form"

const FORM_ID = "program-block-self-referrals-form"

interface ProgramBlockSelfReferralsCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramBlockSelfReferralsCard = ({ program, className }: ProgramBlockSelfReferralsCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Block same email referrals (self-referrals)"
            description="Stop partners from earning commissions on their own referrals."
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramBlockSelfReferralsForm
                // remount with the saved value so Save greys out again after a successful save
                key={`${program.blockSelfReferrals ?? true}`}
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
