"use client"

import React, { useState } from "react"
import Link from "next/link"
import { IconDotsFilled } from "@tabler/icons-react"
import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import type { PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { Button } from "@rewardkit/packages/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@rewardkit/packages/ui/components/dropdown-menu"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@rewardkit/packages/ui/components/alert-dialog"

export const PartnerGroupActions = ({ group }: { group: PartnerGroupsResource }) => {
    // enabled: false -> only the mutations, so each row doesn't start its own list polling
    const { handleSetDefault, handleDelete, isSettingDefault, isDeleting } = usePartnerGroups({ enabled: false })
    const [confirmOpen, setConfirmOpen] = useState(false)

    const onMarkDefault = () => group?.id && handleSetDefault({ partnerGroupId: group.id })

    const onDelete = async () => {
        if (group?.id && await handleDelete({ partnerGroupId: group.id })) setConfirmOpen(false)
    }

    const onConfirmOpenChange = (next: boolean) => {
        // don't let the dialog close mid-request
        if (!next && isDeleting) return
        setConfirmOpen(next)
    }

    return (
        <div className="relative flex items-center gap-2">
            <Button
                size="xs"
                nativeButton={false}
                className="rounded-full"
                variant="outline"
                render={(props) => <Link {...props} href={`/w/program/partner-groups/group/${group.id}`} />}
            >
                Settings
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger aria-label="Group actions">
                    <IconDotsFilled size={15} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            disabled={group.default || isSettingDefault}
                            className="text-xsm"
                            onClick={onMarkDefault}
                        >
                            Mark as default
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={group.default}
                            className="text-xsm"
                            variant="destructive"
                            onClick={() => setConfirmOpen(true)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* outside the menu content, otherwise it unmounts when the menu closes */}
            <AlertDialog open={confirmOpen} onOpenChange={onConfirmOpenChange}>
                <AlertDialogContent className="w-full md:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete group</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{group.name}"? This can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel render={<Button type="button" size="sm" variant="outline" disabled={isDeleting} />}>
                            Cancel
                        </AlertDialogCancel>
                        <Button type="button" size="sm" variant="destructive" isLoading={isDeleting} disabled={isDeleting} onClick={onDelete}>
                            Delete group
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}