import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramCurrencyForm } from "./program-currency.form"

const FORM_ID = "program-currency-form"

interface ProgramCurrencyCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramCurrencyCard = ({ program, className }: ProgramCurrencyCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Program currency"
            description="The program's primary currency."
            footerHint="Only new data is converted to the new currency"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramCurrencyForm
                key={program.currency}
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
