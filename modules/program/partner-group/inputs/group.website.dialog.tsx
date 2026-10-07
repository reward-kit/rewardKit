"use client"

import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import { EditFieldDialog } from "@rewardkit/packages/ui/components/input/dialog/text-edit.dialog"
import type { PartnerGroupsResource } from "@rewardkit/packages/types/partner-groups/partner-groups.schema"
import { toWebsiteUrl } from "@rewardkit/hooks/useForm"
import { getTrpcErrorMessage } from "@rewardkit/lib/trpc/getTRPCError"

/** websiteUrl is stored as a full URL; the input only holds the host ("https://" is the prefix). */
const toHost = (websiteUrl?: string | null) => (websiteUrl ?? "").replace(/^https?:\/\//, "")

export const GroupWebsiteDialog = ({ group }: { group: PartnerGroupsResource }) => {
    const { handleUpdate, isUpdating, update } = usePartnerGroups()

    return (
        <EditFieldDialog
            title="Website"
            description="Update this group's website."
            label="Custom Website URL (Optional)"
            name="website"
            value={toHost(group.websiteUrl)}
            isSaving={isUpdating}
            inputProps={{
                prefix: "https://",
                isError: update.isError,
                errorMessage: getTrpcErrorMessage(update.error),
            }}
            onSave={(website) => {
                if (!group.id) return null
                const host = website.trim()
                // null clears the group's website (the create dialog leaves it unset instead)
                const websiteUrl = host ? toWebsiteUrl(host)! : null
                return handleUpdate({ partnerGroupId: group.id, groupData: { websiteUrl } })
            }}
        />
    )
}
