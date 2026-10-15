import { useAppForm } from "@rewardkit/packages/ui/components/form"
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import {
    ZProgramWebsite,
    type ProgramWebsiteFormValues,
    type ProgramWebsiteValues,
} from "@rewardkit/packages/types/program/program.validator"
import { stripProtocol } from "@rewardkit/lib/http-url"

interface ProgramWebsiteFormProps {
    id?: string
    program?: Pick<ProgramResource, "websiteUrl"> | null
    onSubmit: (values: ProgramWebsiteValues) => void
    onDirtyChange?: (dirty: boolean) => void
}

export const ProgramWebsiteForm = ({
    id = "program-website-form",
    program,
    onSubmit,
    onDirtyChange,
}: ProgramWebsiteFormProps) => {
    const defaultValues: ProgramWebsiteFormValues = {
        websiteUrl: stripProtocol(program?.websiteUrl),
    }

    const form = useAppForm({
        defaultValues,
        validators: { onChange: ZProgramWebsite },
        onSubmit: ({ value }) => {
            const parsed = ZProgramWebsite.parse(value)
            onSubmit({
                ...parsed,
                websiteUrl: `https://${stripProtocol(parsed.websiteUrl)}`,
            })
        },
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
                name="websiteUrl"
                children={(field) => (
                    <field.TextField
                        hideLabel
                        prefix="https://"
                        inputMode="url"
                        autoComplete="off"
                        placeholder="acme.com"
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
