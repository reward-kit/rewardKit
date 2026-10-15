import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramPayoutMethodsForm } from "./program-payout-methods.form"

const FORM_ID = "program-payout-methods-form"

interface ProgramPayoutMethodsCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramPayoutMethodsCard = ({ program, className }: ProgramPayoutMethodsCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Payout methods"
            description="Allowed withdrawal payment methods partners can choose from."
            footerHint="Select at least one method"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramPayoutMethodsForm
                // remount with the saved values so Save greys out again after a successful save
                key={(program.payoutMethods ?? []).join("-")}
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
