// partner-actions.tsx
"use client"

import { useState } from "react"
import { StatusIcon, UserMultiple03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconDotsFilled } from "@tabler/icons-react"
import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import {
    type PartnerStatus,
} from "@rewardkit/packages/types/partner/partner.schema"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@rewardkit/packages/ui/components/dropdown-menu"
import { EditSelectDialog } from "@rewardkit/packages/ui/components/input/dialog/select-edit.dialog"
import { PartnerRow } from "../partner.column.table"
import { usePartner } from "../../../hooks/usePartner"
import { PARTNER_STATUS_OPTIONS } from "../../../contants/status"
import { EditPartnerStatusModal } from "../../partner-status/partner-status.model"

type Props = { partner: PartnerRow }

const partnerIdOf = (p: PartnerRow) => p.id ?? p._id ?? ""

function UpdateGroupDialog({
    partner,
    open,
    onOpenChange,
}: Props & { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { partnerGroups } = usePartnerGroups()
    const { handleUpdate, isUpdating } = usePartner()

    const groupOptions = partnerGroups.map((group) => ({
        label: group.name,
        value: group.id ?? group._id ?? "",
    }))

    return (
        <EditSelectDialog
            open={open}
            onOpenChange={onOpenChange}
            hideTrigger
            title="Update partner group"
            description="Update the partner's group"
            label="Partner group"
            options={groupOptions}
            value={partner.groupId ?? undefined}
            isSaving={isUpdating}
            onSave={(groupId: string) => {
                if (groupId === partner.groupId) return onOpenChange(false)
                handleUpdate({ partnerId: partnerIdOf(partner), partnerData: { groupId } })
            }}
        />
    )
}

export const PartnerActions = ({ partner }: Props) => {
    const [statusOpen, setStatusOpen] = useState(false)
    const [groupOpen, setGroupOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Partner actions"
                >
                    <IconDotsFilled size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setStatusOpen(true)}>
                            <HugeiconsIcon icon={StatusIcon} /> Update partner status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGroupOpen(true)}>
                            <HugeiconsIcon icon={UserMultiple03Icon} /> Update partner group
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {partner && <EditPartnerStatusModal partner={partner} open={statusOpen} onOpenChange={setStatusOpen} />}
            <UpdateGroupDialog partner={partner} open={groupOpen} onOpenChange={setGroupOpen} />
        </>
    )
}