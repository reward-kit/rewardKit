import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramPayoutTermForm } from "./program-payout-term.form"

const FORM_ID = "program-payout-term-form"

interface ProgramPayoutTermCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramPayoutTermCard = ({ program, className }: ProgramPayoutTermCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Payout term"
            description={`Payouts are generated ${program.payoutTerm ?? 30} days after the end of each month for the previous month.`}
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramPayoutTermForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.payoutTerm}
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
