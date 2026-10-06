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

export const GeneralSettingsTab = () => {
    const { program, isLoading, error } = useProgram();

    const isProgramActive = program?.status == "active"

    return (
        <div className='grid grid-cols-1 gap-4'>
            <Settings>
                <SettingsHeader>
                    <SettingsTitle>General</SettingsTitle>
                    <SettingsDescription>Configure the core details partners see in your program.</SettingsDescription>
                </SettingsHeader>
                <SettingsContent>
                    <SettingsRow
                        title="Program ID"
                        action={<CopyableId showCopyButton isLoading={isLoading} value={program?.id ?? "-"} />}
                    />
                    <SettingsRow
                        title="Partner program name"
                        value={program?.name}
                        action={<ProgramNameDialog />}
                    />
                    <SettingsRow
                        title="Product name"
                        description="This will be the name of the product/app that partners will see in the portal."
                        value={program?.productName}
                        action={<ProgramProductNameDialog />}
                    />
                    <SettingsRow
                        title="Website"
                        value={program?.websiteUrl}
                        action={<ProgramWebsiteDialog />}
                    />
                    <SettingsRow
                        title="Program currency"
                        value={program?.currency}
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
                        value={program?.payoutMinimumThreshold}
                        action={<ProgramPayoutThresholdDialog />}
                    />
                    <SettingsRow
                        title="Payout term"
                        description={`Payouts are generated ${program?.payoutTerm} days after the end of each month for the previous month.`}
                        value={program?.payoutTerm}
                        action={<ProgramPayoutTermsDialog />}
                    />
                    <SettingsRow
                        title="Payout methods"
                        value={program?.payoutMethods?.join(", ")}
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
    )
}
