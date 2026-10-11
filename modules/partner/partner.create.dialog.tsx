"use client"

import React, { useState } from 'react'
import { usePartner } from '@rewardkit/packages/features/partner/hooks/usePartner'
import { usePartnerGroups } from '@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups'
import { CreatePartnerInput, ZCreatePartnerInput } from '@rewardkit/packages/types/partner/partner.api.schema'
import { PAYOUT_METHOD } from '@rewardkit/packages/types/payout/payout.schema'
import { ALL_COUNTRIES_WITH_FLAGS } from '@rewardkit/lib/countries'
import { toOptionalString, useSchemaForm } from '@rewardkit/hooks/useForm'
import { Button } from '@rewardkit/packages/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rewardkit/packages/ui/components/dialog'
import { TextInput } from '@rewardkit/packages/ui/components/input/text.input'
import { SelectInput } from '@rewardkit/packages/ui/components/input/select.input'
import { ScrollArea } from '@rewardkit/packages/ui/components/scroll-area'
import { CommandAvatarInput } from '@rewardkit/packages/ui/components/input/command.avatar.input'
import { IconInnerShadowBottomRightFilled } from '@tabler/icons-react'
import { PARTNER_STATUS, PARTNER_STATUS_OPTIONS } from '@rewardkit/packages/types/partner/partner.schema'

const FORM_ID = "create-partner-form"

export const PAYOUT_METHOD_OPTIONS = [
    { label: "PayPal", value: PAYOUT_METHOD.PAYPAL },
    { label: "Wise", value: PAYOUT_METHOD.WISE },
]

const INITIAL_VALUES = {
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    countryCode: "",
    groupId: "",
    payoutMethod: null as (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD] | null,
    payoutDetails: {
        email: ""
    },
    status: PARTNER_STATUS.ACTIVE,
}

export const PartnerCreateDialog = () => {
    const { partnerGroups } = usePartnerGroups()
    const { handleCreate, isCreating } = usePartner()
    const [open, setOpen] = useState(false)

    const groupOptions = partnerGroups.map((group) => ({
        label: group.name,
        value: group.id ?? group._id ?? "",
    }))

    const form = useSchemaForm({
        schema: ZCreatePartnerInput.shape.partnerData,
        initialValues: INITIAL_VALUES,
        toInput: (v) => ({
            firstName: v.firstName.trim(),
            lastName: v.lastName.trim(),
            companyName: toOptionalString(v.companyName),
            email: v.email.trim(),
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
        if (!next && isCreating) return
        setOpen(next)
        if (!next) form.reset()
    }

    // the hook toasts success and failure, so only the result matters here
    const onSubmit = form.handleSubmit(async (partner) => {
        console.log(partner)
        if (await handleCreate({ partner })) handleOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={(props) => <Button {...props} variant={"secondary"} size={"sm"} className={"rounded-[12px] active:text-white focus:text-white bg-blue-600! focus-within: h-8 px-2 text-white data-popup-open:text-white!"} />}>
                <IconInnerShadowBottomRightFilled />
                Create partner
            </DialogTrigger>

            <DialogContent className={"md:max-w-md w-full"}>
                <DialogHeader>
                    <DialogTitle>Create partner</DialogTitle>
                    <DialogDescription>Add a partner to your program.</DialogDescription>
                </DialogHeader>

                <ScrollArea className={"pt-0"}>
                    <form id={FORM_ID} onSubmit={onSubmit} noValidate className='flex flex-col gap-4 px-1'>
                        <TextInput label='First name' placeholder='Jane' required autoFocus disabled={isCreating} {...form.field("firstName")} />
                        <TextInput label='Last name' placeholder='Doe' required disabled={isCreating} {...form.field("lastName")} />
                        <TextInput label='Company name (Optional)' placeholder='Acme Inc.' disabled={isCreating} {...form.field("companyName")} />
                        <TextInput type='email' label='Email' placeholder='jane@example.com' required disabled={isCreating} {...form.field("email")} />
                        <CommandAvatarInput
                            label='Country'
                            required
                            placeholder='Select country'
                            value={form.values.countryCode}
                            onChange={(v) => form.setValue("countryCode", v ?? "")}
                            options={ALL_COUNTRIES_WITH_FLAGS}
                            isError={!!form.errors.countryCode}
                            errorMessage={form.errors.countryCode}
                            disabled={isCreating}
                        />
                        <SelectInput
                            label='Group (Optional)'
                            placeholder='Select group'
                            value={form.values.groupId || null}
                            onChange={(v) => form.setValue("groupId", v ?? "")}
                            options={groupOptions}
                            isError={!!form.errors.groupId}
                            errorMessage={form.errors.groupId}
                            disabled={isCreating}
                        />
                        <SelectInput
                            label='Status'
                            placeholder='Select status'
                            value={form.values.status || null}
                            onChange={(v) => form.setValue("status", (v as any) ?? PARTNER_STATUS.ACTIVE)}
                            options={PARTNER_STATUS_OPTIONS}
                            isError={!!form.errors.status}
                            errorMessage={form.errors.status}
                            disabled={isCreating}
                        />
                        <SelectInput
                            label='Payout method (Optional)'
                            placeholder='Select payout method'
                            value={form.values.payoutMethod || null}
                            onChange={(v) => form.setValue("payoutMethod", (v as any) || null)}
                            options={PAYOUT_METHOD_OPTIONS}
                            isError={!!form.errors.payoutMethod}
                            errorMessage={form.errors.payoutMethod}
                            disabled={isCreating}
                        />
                        {form.values.payoutMethod && (
                            <TextInput
                                type='email'
                                label='Payout email'
                                placeholder='payouts@example.com'
                                required
                                disabled={isCreating}
                                isError={!!form.errors.payoutDetails}
                                errorMessage={form.errors.payoutDetails}
                                value={typeof form.values.payoutDetails === 'object' && form.values.payoutDetails !== null ? form.values.payoutDetails.email : ""}
                                onChange={(v) => form.setValue("payoutDetails", { email: v })}
                            />
                        )}
                    </form>
                </ScrollArea>

                <DialogFooter>
                    <DialogClose render={<Button type="button" size="sm" variant="outline" disabled={isCreating} />}>
                        Cancel
                    </DialogClose>
                    {/* outside the <form> in the DOM, so it is linked with the form attribute */}
                    <Button type="submit" isLoading={isCreating} form={FORM_ID} size="sm" disabled={isCreating}>
                        Create partner
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}