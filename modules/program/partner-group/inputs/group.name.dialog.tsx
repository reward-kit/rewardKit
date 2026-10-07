"use client"

import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import { EditFieldDialog } from "@rewardkit/packages/ui/components/input/dialog/text-edit.dialog"
import type { PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

export const GroupNameDialog = ({ group }: { group: PartnerGroupsResource }) => {
    const { handleUpdate, isUpdating, update } = usePartnerGroups()

    return (
        <EditFieldDialog
            title="Group name"
            description="Update this group's name."
            label="Group name"
            name="name"
            value={group.name}
            isSaving={isUpdating}
            inputProps={{
                maxLength: 60,
                isError: update.isError,
                errorMessage: getTrpcErrorMessage(update.error),
            }}
            onSave={(name) => (group.id ? handleUpdate({ partnerGroupId: group.id, groupData: { name } }) : null)}
        />
    )
}
