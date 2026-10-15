import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramBlockSelfReferrals,
    type ProgramBlockSelfReferralsFormValues,
    type ProgramBlockSelfReferralsValues,
} from "@rewardkit/packages/types/program/program.validator"

interface ProgramBlockSelfReferralsFormProps {
    id?: string
    program?: Pick<ProgramResource, "blockSelfReferrals"> | null
    onSubmit: (values: ProgramBlockSelfReferralsValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramBlockSelfReferralsForm = ({
    id = "program-block-self-referrals-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramBlockSelfReferralsFormProps) => {
    const defaultValues: ProgramBlockSelfReferralsFormValues = {
        blockSelfReferrals: program?.blockSelfReferrals ?? true,
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramBlockSelfReferrals },
        onSubmit: ({ value }) => onSubmit(ZProgramBlockSelfReferrals.parse(value)),
    })

    return (
        <form
            id={id}
            noValidate
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <form.AppField
                name="blockSelfReferrals"
                children={(field) => (
                    <field.SwitchField
                        description="Block partners from referring themselves with the same email address"
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.isDefaultValue}>
                {(isDefaultValue) => (
                    <DirtyReporter isDefaultValue={isDefaultValue} onDirtyChange={onDirtyChange} />
                )}
            </form.Subscribe>
        </form>
    )
}
