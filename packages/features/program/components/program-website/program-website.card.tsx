import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramWebsiteForm } from "./program-website.form"

const FORM_ID = "program-website-form"

interface ProgramWebsiteCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramWebsiteCard = ({ program, className }: ProgramWebsiteCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    return (
        <FormCard
            className={className}
            title="Website"
            description="This URL is used to create tracking links for your partners."
            footerHint="Enter a domain, like acme.com"
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramWebsiteForm
                key={program.websiteUrl}
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
