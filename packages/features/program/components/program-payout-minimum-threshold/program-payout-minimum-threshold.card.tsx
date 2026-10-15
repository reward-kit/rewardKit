import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramPayoutMinimumThresholdForm } from "./program-payout-minimum-threshold.form"

const FORM_ID = "program-payout-minimum-threshold-form"

interface ProgramPayoutMinimumThresholdCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramPayoutMinimumThresholdCard = ({
    program,
    className,
}: ProgramPayoutMinimumThresholdCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Minimum payout threshold"
            description="The minimum amount a partner must earn before a payout can be generated."
            footerHint="Leave empty for no minimum"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramPayoutMinimumThresholdForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.payoutMinimumThreshold ?? "none"}
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
