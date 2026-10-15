import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramCustomerVisibilityForm } from "./program-customer-visibility.form"

const FORM_ID = "program-customer-visibility-form"

interface ProgramCustomerVisibilityCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramCustomerVisibilityCard = ({ program, className }: ProgramCustomerVisibilityCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Customer information visibility"
            description="Control what partners can see about the customers they refer."
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramCustomerVisibilityForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.customerIdentifyVisiblity ?? "hide"}
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
