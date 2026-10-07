"use client"
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { CopyableId } from '@rewardkit/packages/ui/components/copyable-id'
import { Settings, SettingsContent, SettingsDescription, SettingsFooter, SettingsHeader, SettingsRow, SettingsTitle } from '@rewardkit/packages/ui/components/layout/settings.layout'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { ProgramNameDialog } from './general/program.name.dialog'
import { ProgramProductNameDialog } from './general/program.product-name.dialog'
import { ProgramWebsiteDialog } from './general/program.websiet.dialog'
import { ProgramCurrencyDialog } from './general/program.currency'
import { ProgramPayoutTermsDialog } from './payout/payout-terms.dialog'
import { ProgramPayoutThresholdDialog } from './payout/minimum-threshold.dialog'
import { ProgramPayoutMethodDialog } from './payout/payout-methods.dialog'
import { ProgramStatusDialog } from './status/program-status.dialog'
import { DeleteProgramDialog } from './delete/delete-program'
import { Dashboard, DashboardContent, DashboardHeader, DashboardTitle } from '@rewardkit/packages/ui/components/layout/dashboard.layout'

export const GeneralSettingsPage = () => {
    const { program, isLoading, error } = useProgram();

    const isProgramActive = program?.status == "active"

    return (
        <Dashboard className='max-w-2xl mx-auto'>
            <DashboardHeader className='px-7'>
                <DashboardTitle>General Settings</DashboardTitle>
            </DashboardHeader>
            <DashboardContent>
                <div className='grid grid-cols-1 gap-6'>
                    <Settings>
                        <SettingsHeader>
                            <SettingsTitle>General</SettingsTitle>
                            <SettingsDescription>Configure the core details partners see in your program.</SettingsDescription>
                        </SettingsHeader>
                        <SettingsContent>
                            <SettingsRow
                                title="Program ID"
                                description="Identifies your program in the widget and API."
                                action={<CopyableId showCopyButton isLoading={isLoading} value={program?.id ?? "-"} />}
                            />
                            <SettingsRow
                                title="Partner program name"
                                description="The partner program's name"
                                action={<ProgramNameDialog />}
                            />
                            <SettingsRow
                                title="Product name"
                                description="This will be the name of the product/app that partners will see in the portal."
                                action={<ProgramProductNameDialog />}
                            />
                            <SettingsRow
                                title="Website"
                                description="This URL will be used to create tracking links for your partners"
                                action={<ProgramWebsiteDialog />}
                            />
                            <SettingsRow
                                title="Program currency"
                                description="The program's primary currency"
                                action={<ProgramCurrencyDialog />}
                            />
                        </SettingsContent>
                        <SettingsFooter>
                            {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                        </SettingsFooter>
                    </Settings>
                    <Settings>
                        <SettingsHeader>
                            <SettingsTitle>Payout</SettingsTitle>
                            <SettingsDescription>Set payout thresholds, payout timing, and available payout methods.</SettingsDescription>
                        </SettingsHeader>
                        <SettingsContent>
                            <SettingsRow
                                title="Minimum payout threshold"
                                description="This is the minimum amount that a partner must earn before a payout can be generated"
                                action={<ProgramPayoutThresholdDialog />}
                            />
                            <SettingsRow
                                title="Payout term"
                                description={`Payouts are generated ${program?.payoutTerm} days after the end of each month for the previous month.`}
                                action={<ProgramPayoutTermsDialog />}
                            />
                            <SettingsRow
                                title="Payout methods"
                                description="Allowed withdrawal payment methods"
                                action={<ProgramPayoutMethodDialog />}
                            />
                        </SettingsContent>
                        <SettingsFooter>
                            {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                        </SettingsFooter>
                    </Settings>
                    <Settings>
                        <SettingsHeader>
                            <SettingsTitle>Program status</SettingsTitle>
                            <SettingsDescription>Pause or resume partner earning for this program.</SettingsDescription>
                        </SettingsHeader>
                        <SettingsContent>
                            <SettingsRow
                                title="Affiliate program status"
                                description={isProgramActive
                                    ? "Your program is live. Partners earn commissions on new referrals."
                                    : "Your program is paused. Partners can't earn new commissions until you reactivate it."}
                                action={<ProgramStatusDialog />}
                            />
                        </SettingsContent>
                        <SettingsFooter>
                            {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                        </SettingsFooter>
                    </Settings>

                    <Settings>
                        <SettingsHeader>
                            <SettingsTitle>Danger zone</SettingsTitle>
                            <SettingsDescription>Permanent actions that can't be undone.</SettingsDescription>
                        </SettingsHeader>
                        <SettingsContent>
                            <SettingsRow
                                title="Delete program"
                                description="Permanently deletes this program, its portal subdomain and all uploaded files. Partners lose access immediately."
                                action={<DeleteProgramDialog />}
                            />
                        </SettingsContent>
                    </Settings>
                </div>
            </DashboardContent>
        </Dashboard>
    )
}
