"use client"

import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { Settings, SettingsContent, SettingsHeader, SettingsRow, SettingsTitle } from '@rewardkit/packages/ui/components/layout/settings.layout'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { Dashboard, DashboardContent, DashboardHeader, DashboardTitle } from '@rewardkit/packages/ui/components/layout/dashboard.layout'
import { usePartnerGroups } from '@rewardkit/packages/features/partner-groups/hooks/usePartnerGroups'
import { HugeiconsIcon } from '@hugeicons/react'
import { LockKeyholeIcon, UserMultiple03Icon } from '@hugeicons/core-free-icons'
import { PartnerGroupCreateDialog } from './partner-group/partner-group.create.dialog'
import { PartnerGroupActions } from './partner-group/partner-group.actions'

export const PartnerGroupsPage = () => {
    const { partnerGroups } = usePartnerGroups();
    return (
        <Dashboard className='max-w-190 px-4 mx-auto'>
            <DashboardContent>
                <div className='grid grid-cols-1 gap-6'>
                    <Settings>
                        <SettingsHeader className='flex flex-row items-center justify-between'>
                            <SettingsTitle>Groups</SettingsTitle>
                            <PartnerGroupCreateDialog />
                        </SettingsHeader>

                        {partnerGroups.length <= 0 &&
                            <div className='text-center flex flex-col items-center gap-2 mt-8'>
                                <HugeiconsIcon className='bg-muted p-2 rounded-full' size={38} icon={UserMultiple03Icon} />
                                <Small>No groups created yet</Small>
                            </div>
                        }
                        {partnerGroups.length > 0 &&
                            <SettingsContent>
                                {partnerGroups.map((group, i) => (
                                    <SettingsRow
                                        key={i}
                                        title={group.name}
                                        tooltip={group.default ? "The default group is assigned to every new partner." : undefined}
                                        tooltipTriggerClassName='text-yellow-500 hover:text-yellow-500'
                                        tag={group?.isPrivate ? { title: "private group",children: <HugeiconsIcon size={18} icon={LockKeyholeIcon}/>, className: "bg-transparent border-0" } : undefined}
                                        className="pr-2"
                                        action={<PartnerGroupActions group={group} />}
                                    />
                                ))}
                            </SettingsContent>
                        }
                    </Settings>
                </div>
            </DashboardContent>
        </Dashboard>
    )
}
