"use client"
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { ProgramNameCard } from '@rewardkit/packages/features/program/components/program-name/program-name.card'
import { ProgramProductNameCard } from '@rewardkit/packages/features/program/components/program-product-name/program-product-name.card'
import { ProgramWebsiteCard } from '@rewardkit/packages/features/program/components/program-website/program-website.card'
import { ProgramCurrencyCard } from '@rewardkit/packages/features/program/components/program-currency/program-currency.card'
import { ProgramStatusCard } from '@rewardkit/packages/features/program/components/program-status/program-status.card'
import { ProgramIdCard } from '@rewardkit/packages/features/program/components/program-id/program-id.card'
import { Settings, SettingsContent, SettingsDescription, SettingsFooter, SettingsHeader, SettingsRow, SettingsTitle } from '@rewardkit/packages/ui/components/layout/settings.layout'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { Dashboard, DashboardContent } from '@rewardkit/packages/ui/components/layout/dashboard.layout'
import { DeleteProgramDialog } from './delete/delete-program'

export const GeneralSettingsPage = () => {
    const { program, isLoading, error } = useProgram();

    return (
        <Dashboard>
            <DashboardContent isLoading={isLoading}>
                {error && (
                    <div className='mb-4 flex gap-1 items-center text-destructive'>
                        <HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} />
                        <Small className='inline text-xs text-destructive'>Error: {error.message}</Small>
                    </div>
                )}

                {program && (
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-1 w-full'>
                        <ProgramIdCard program={program} />
                        <ProgramNameCard program={program} />
                        <ProgramProductNameCard program={program} />
                        <ProgramWebsiteCard program={program} />
                        <ProgramCurrencyCard program={program} />
                        <ProgramStatusCard program={program} />
                    </div>
                )}

                <Settings className='mt-6' variant='danger'>
                    <SettingsHeader>
                        <SettingsTitle>Danger zone</SettingsTitle>
                        <SettingsDescription>Permanent actions that can't be undone.</SettingsDescription>
                    </SettingsHeader>
                    <SettingsContent>
                        <SettingsRow
                            action={<DeleteProgramDialog />}
                        />
                    </SettingsContent>
                    <SettingsFooter>
                        <Small className="text-xs group-data-[variant=danger]/settings:text-red-500">Permanently deletes this program, its portal subdomain and all uploaded files. Partners lose access immediately.</Small>
                    </SettingsFooter>
                </Settings>
            </DashboardContent>
        </Dashboard>
    )
}
