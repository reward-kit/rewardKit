import React from "react"
import toast from "react-hot-toast"
import { FormCard } from "@rewardkit/packages/ui/components/card/form.card"
import {
    PROGRAM_STATUS,
    type ProgramResource,
    type ProgramStatus,
} from "@rewardkit/packages/types/program/program.schema"
import { useProgram } from "../../hooks/useProgram"
import { ProgramStatusForm } from "./program-status.form"

const FORM_ID = "program-status-form"

const STATUS_HINT: Record<ProgramStatus, string> = {
    [PROGRAM_STATUS.ACTIVE]: "Your program is live. Partners earn commissions on new referrals.",
    [PROGRAM_STATUS.INACTIVE]: "Your program is paused. Partners can't earn new commissions until you reactivate it.",
}

interface ProgramStatusCardProps {
    program: ProgramResource
    className?: string
}

export const ProgramStatusCard = ({ program, className }: ProgramStatusCardProps) => {
    const programId = program?.id ?? program?._id
    const { update } = useProgram()
    const [dirty, setDirty] = React.useState(false)

    const savedStatus = program.status ?? PROGRAM_STATUS.ACTIVE
    const [selectedStatus, setSelectedStatus] = React.useState<ProgramStatus>(savedStatus)

    return (
        <FormCard
            className={className}
            title="Program status"
            description="Pause or resume partner earning for this program."
            footerHint={STATUS_HINT[selectedStatus]}
            formId={FORM_ID}
            isPending={update.isPending}
            submitDisabled={!dirty}
        >
            <ProgramStatusForm
                // remount with the saved value so Save greys out again after a successful save
                key={program.status}
                id={FORM_ID}
                program={program}
                onDirtyChange={setDirty}
                onStatusChange={setSelectedStatus}
                onSubmit={(values) => {
                    if (!programId) return toast.error("Program ID is missing")
                    update.mutate({ programId, programData: values })
                }}
            />
        </FormCard>
    )
}
