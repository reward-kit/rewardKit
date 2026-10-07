"use client"
import React, { useState } from 'react'
import { usePartnerGroups } from '@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { ZCreatePartnerGroupInput } from '@rewardkit/packages/types/partner-groups/partner-groups.api.schema'
import { useSchemaForm, toOptionalNumber, toOptionalString, toWebsiteUrl } from '@rewardkit/hooks/useForm'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { SwitchInput } from '@rewardkit/packages/ui/components/input/switch.input'
import { TextInput } from '@rewardkit/packages/ui/components/input/text.input'
import { TextareaInput } from '@rewardkit/packages/ui/components/input/textarea.input'
import { ScrollArea } from '@rewardkit/packages/ui/components/scroll-area'

const FORM_ID = "create-partner-group-form"

const INITIAL_VALUES = {
    name: "",
    description: "",
    website: "", // host only, "https://" is the input prefix
    payout: "",
    isPrivate: false,
}

export const PartnerGroupCreateDialog = () => {
    const { program } = useProgram()
    const { handleCreate, isCreating } = usePartnerGroups()
    const [open, setOpen] = useState(false)

    const form = useSchemaForm({
        schema: ZCreatePartnerGroupInput.shape.groupData,
        initialValues: INITIAL_VALUES,
        errorKeys: { websiteUrl: "website", payoutMinimumThreshold: "payout" },
        toInput: (v) => ({
            name: v.name.trim(),
            description: toOptionalString(v.description),
            websiteUrl: toWebsiteUrl(v.website),
            payoutMinimumThreshold: toOptionalNumber(v.payout),
            isPrivate: v.isPrivate,
        }),
    })

    const handleOpenChange = (next: boolean) => {
        // don't let the dialog close mid-request
        if (!next && isCreating) return
        setOpen(next)
        if (!next) form.reset()
    }

    // the hook toasts success and failure, so only the result matters here
    const onSubmit = form.handleSubmit(async (group) => {
        if (await handleCreate({ group })) handleOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={(props) => <Button {...props} variant={"secondary"} size={"sm"} className={"rounded-full"} />}>
                Create group
            </DialogTrigger>

            <DialogContent className={"md:max-w-lg w-full"}>
                <DialogHeader>
                    <DialogTitle>Create group</DialogTitle>
                    <DialogDescription>Sort your affiliates into groups to simplify tracking and management.</DialogDescription>
                </DialogHeader>

                <ScrollArea>
                    <form id={FORM_ID} onSubmit={onSubmit} noValidate className='p-6 pt-0 flex flex-col gap-4'>
                        <TextInput label='Group name' placeholder='Agency partners' autoFocus disabled={isCreating} {...form.field("name")} />
                        <TextareaInput label='Description (Optional)' placeholder='Earn 20% as agency partner' maxLength={200} disabled={isCreating} {...form.field("description")} />
                        <TextInput
                            prefix={"https://"}
                            placeholder='e.g example.com'
                            label='Custom Website URL (Optional)'
                            hint="When provided, this URL will override the program's website URL for this group only."
                            disabled={isCreating}
                            {...form.field("website")}
                        />
                        <TextInput
                            prefix={program?.currency ?? "USD"}
                            placeholder="e.g 50"
                            inputMode="decimal"
                            label='Minimum payout (Optional)'
                            hint="Set a minimum payout threshold for this group. Partners in this group must reach this amount before a payout can be generated."
                            disabled={isCreating}
                            {...form.field("payout")}
                        />
                        <SwitchInput
                            label="Make group private"
                            description="Approve new partners manually for this group"
                            checked={form.values.isPrivate}
                            onChange={(checked) => form.setValue("isPrivate", checked)}
                            disabled={isCreating}
                        />
                    </form>
                </ScrollArea>

                <DialogFooter>
                    <DialogClose render={<Button type="button" size="sm" variant="outline" disabled={isCreating} />}>
                        Cancel
                    </DialogClose>
                    {/* outside the <form> in the DOM, so it is linked with the form attribute */}
                    <Button type="submit" isLoading={isCreating} form={FORM_ID} size="sm" disabled={isCreating}>
                        Create group
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}