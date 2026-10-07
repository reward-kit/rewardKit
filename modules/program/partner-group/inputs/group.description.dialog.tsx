"use client"

import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import { TextareaEditDialog } from "@rewardkit/packages/ui/components/input/dialog/textarea-edit.dialog"
import type { PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

export const GroupDescriptionDialog = ({ group }: { group: PartnerGroupsResource }) => {
    const { handleUpdate, isUpdating, update } = usePartnerGroups()

    return (
        <TextareaEditDialog
            title="Description"
            description="Update the group's description."
            label="Description (Optional)"
            name="description"
            value={group.description}
            rows={4}
            maxLength={200}
            placeholder="Earn 20% as agency partner"
            isSaving={isUpdating}
            inputProps={{
                isError: update.isError,
                errorMessage: getTrpcErrorMessage(update.error),
            }}
            onSave={(description) =>
                group.id ? handleUpdate({ partnerGroupId: group.id, groupData: { description: description || null } }) : null
            }
        />
    )
}
