import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramProductNameForm } from "./program-product-name.form"

const FORM_ID = "program-product-name-form"

interface ProgramProductNameCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramProductNameCard = ({ program, className }: ProgramProductNameCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Product name"
            description="This is the name of the product/app that partners see in the portal."
            footerHint="Maximum of 100 characters"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramProductNameForm
                key={program.productName}
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
