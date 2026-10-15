"use client"

import { useState } from 'react'
import { usePartner } from '@rewardkit/packages/features/partner/hooks/usePartner'
import { usePartnerGroups } from '@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups'
import { ZCreatePartnerInput } from '@rewardkit/packages/types/partner/partner.api.schema'
import { ALL_COUNTRIES_WITH_FLAGS } from '@rewardkit/lib/countries'
import { toOptionalString, useSchemaForm } from '@rewardkit/hooks/useForm'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { TextInput } from '@rewardkit/packages/ui/components/input/text.input'
import { SelectInput } from '@rewardkit/packages/ui/components/input/select.input'
import { ScrollArea } from '@rewardkit/packages/ui/components/scroll-area'
import { CommandAvatarInput } from '@rewardkit/packages/ui/components/input/command.avatar.input'
import { PARTNER_STATUS, PartnerResource } from '@rewardkit/packages/types/partner/partner.schema'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit01Icon } from '@hugeicons/core-free-icons'
import { PAYOUT_METHOD_OPTIONS } from '@rewardkit/packages/features/payouts/constant'
import { PARTNER_STATUS_OPTIONS } from '@rewardkit/packages/features/partner/contants/status'

const FORM_ID = "edit-partner-form"

/* Saved partner -> form values. Used for the first render and every time the dialog opens. */
const toFormValues = (p: PartnerResource) => ({
    firstName: p.firstName ?? "",
    lastName: p.lastName ?? "",
    companyName: p.companyName ?? "",
    email: p.email ?? "",
    countryCode: p.countryCode ?? "",
    groupId: p.groupId ?? "",
    payoutMethod: p.payoutMethod ?? null,
    payoutDetails: { email: p.payoutDetails?.email ?? "" },
    status: p.status ?? PARTNER_STATUS.PENDING,
})

type Props = {
    partnerData: PartnerResource
    /** optional custom trigger label; defaults to "Edit details" */
    children?: React.ReactNode
}

export const PartnerEditDialog = ({ partnerData, children }: Props) => {
    const partnerId = (partnerData.id ?? partnerData._id) as string

    const { partnerGroups } = usePartnerGroups()
    const { handleUpdate, isUpdating } = usePartner()

    const [open, setOpen] = useState(false)

    const form = useSchemaForm({
        schema: ZCreatePartnerInput.shape.partnerData,
        initialValues: toFormValues(partnerData),
        toInput: (v) => ({
            firstName: v.firstName.trim(),
            lastName: v.lastName.trim(),
            // null (not undefined) so clearing the field actually clears it in the database
            companyName: v.companyName.trim() || null,
            email: v.email.trim().toLowerCase(),
            countryCode: v.countryCode.trim().toUpperCase(),
            groupId: toOptionalString(v.groupId),
            status: v.status,
            payoutMethod: v.payoutMethod || null,
            payoutDetails: v.payoutMethod && typeof v.payoutDetails === 'object' && v.payoutDetails !== null
                ? { email: v.payoutDetails.email.trim().toLowerCase() }
                : null,
        }),
    })

    const handleOpenChange = (next: boolean) => {
        // don't let the dialog close mid-request
        if (!next && isUpdating) return

        if (next) {
            // always start from the latest saved values, not whatever was left from last time
            const values = toFormValues(partnerData)
                ; (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
                    form.setValue(key as any, values[key] as any)
                })
        } else {
            form.reset()
        }
        setOpen(next)
    }

    // the hook toasts success and failure, so only close when it didn't report a failure
    const onSubmit = form.handleSubmit(async (data) => {
        const result = await handleUpdate({ partnerId, partnerData: data })
        if (result?.success !== false) handleOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={(props) => <Button {...props} type="button" variant="secondary" className="rounded-full" size="xs" />}>
                Edit details
            </DialogTrigger>

            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit partner</DialogTitle>
                    <DialogDescription>Update this partner's details.</DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[65svh] pt-0">
                    <form id={FORM_ID} onSubmit={onSubmit} noValidate className="flex flex-col gap-4 px-1">
                        <TextInput label="First name" placeholder="Jane" required autoFocus disabled={isUpdating} {...form.field("firstName")} />
                        <TextInput label="Last name" placeholder="Doe" required disabled={isUpdating} {...form.field("lastName")} />
                        <TextInput label="Company name (Optional)" placeholder="Acme Inc." disabled={isUpdating} {...form.field("companyName")} />
                        <TextInput type="email" label="Email" placeholder="jane@example.com" required disabled={isUpdating} {...form.field("email")} />
                        <CommandAvatarInput
                            label="Country"
                            required
                            placeholder="Select country"
                            value={form.values.countryCode}
                            onChange={(v) => form.setValue("countryCode", v ?? "")}
                            options={ALL_COUNTRIES_WITH_FLAGS}
                            isError={!!form.errors.countryCode}
                            errorMessage={form.errors.countryCode}
                            disabled={isUpdating}
                        />
                    </form>
                </ScrollArea>

                <DialogFooter>
                    <DialogClose render={<Button type="button" size="sm" variant="outline" disabled={isUpdating} />}>
                        Cancel
                    </DialogClose>
                    {/* outside the <form> in the DOM, so it is linked with the form attribute */}
                    <Button type="submit" form={FORM_ID} size="sm" isLoading={isUpdating} disabled={isUpdating}>
                        Update partner
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}