"use client"

import { usePartnerGroups } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups"
import type { usePartnerGroup } from "@rewardkit/packages/features/partner-groups/hooks/usePartnerGroup"
import { Switch } from "@rewardkit/packages/ui/components/switch"
import { Settings, SettingsContent, SettingsDescription, SettingsHeader, SettingsRow, SettingsTitle } from "@rewardkit/packages/ui/components/layout/settings.layout"
import { GroupDescriptionDialog } from "./inputs/group.description.dialog"
import { GroupNameDialog } from "./inputs/group.name.dialog"
import { GroupPayoutDialog } from "./inputs/group.payout.dialog"
import { GroupWebsiteDialog } from "./inputs/group.website.dialog"

type Group = NonNullable<ReturnType<typeof usePartnerGroup>["group"]>

export const PartnerGroupEditForm = ({ group }: { group: Group }) => {
    const { handleUpdate, isUpdating } = usePartnerGroups()

    return (
        <div className='grid grid-cols-1 gap-6'>
            <Settings>
                <SettingsHeader>
                    <SettingsTitle>General</SettingsTitle>
                    <SettingsDescription>Configure the core details partners see for this group.</SettingsDescription>
                </SettingsHeader>
                <SettingsContent>
                    <SettingsRow
                        title="Group name"
                        description="The group's name"
                        action={<GroupNameDialog group={group} />}
                    />
                    <SettingsRow
                        title="Description"
                        description="Shown next to the group in your workspace"
                        action={<GroupDescriptionDialog group={group} />}
                    />
                    <SettingsRow
                        title="Website"
                        description="When provided, this URL will override the program's website URL for this group only."
                        action={<GroupWebsiteDialog group={group} />}
                    />
                    <SettingsRow
                        title="Minimum payout"
                        description="Partners in this group must reach this amount before a payout can be generated."
                        action={<GroupPayoutDialog group={group} />}
                    />
                    <SettingsRow
                        title="Make group private"
                        description="Approve new partners manually for this group"
                        action={
                            <Switch
                                size="sm"
                                checked={group.isPrivate ?? false}
                                disabled={isUpdating}
                                onCheckedChange={(isPrivate) =>
                                    group.id && handleUpdate({ partnerGroupId: group.id, groupData: { isPrivate } })
                                }
                            />
                        }
                    />
                </SettingsContent>
            </Settings>
        </div>
    )
}
