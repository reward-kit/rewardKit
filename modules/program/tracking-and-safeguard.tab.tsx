import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { Settings, SettingsContent, SettingsDescription, SettingsFooter, SettingsHeader, SettingsRow, SettingsTitle } from '@rewardkit/packages/ui/components/layout/settings.layout'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { CookieDurationEditDialog } from './attribution/cookie-duration.dialog'
import { URLParameterDialog } from './attribution/url-parameter.dialog'
import { SelfReferDialog } from './referral-safeguards/self-refer.dialog'
import { BlockPersonalMailUseDialog } from './referral-safeguards/block-personal-mail-use.dialog'
import { RestrictedCountriesDialog } from './referral-safeguards/restrict-countries.dialog'
import { CustomerVisibilityDialog } from './partner-tools/customer-identity.dialog'

export const TrackingAndSafeguardTab = () => {
    const { error } = useProgram();

    return (
        <div className='grid grid-cols-1 gap-4'>
            <Settings>
                <SettingsHeader>
                    <SettingsTitle>Attribution tracking</SettingsTitle>
                    <SettingsDescription>Cookies, links, URL parameters, and the program-wide coupon partners share.</SettingsDescription>
                </SettingsHeader>
                <SettingsContent>
                    <SettingsRow
                        title="Cookie duration"
                        action={<CookieDurationEditDialog />}
                    />
                    <SettingsRow
                        title="URL parameters"
                        action={<URLParameterDialog />}
                    />
                </SettingsContent>
                <SettingsFooter>
                    {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                </SettingsFooter>
            </Settings>
            <Settings>
                <SettingsHeader>
                    <SettingsTitle>Referral safeguards</SettingsTitle>
                    <SettingsDescription>Block risky traffic, countries, and control what partners see about earnings.</SettingsDescription>
                </SettingsHeader>
                <SettingsContent>
                    <SettingsRow
                        title="Block same email referrals (self-referrals)"
                        action={<SelfReferDialog />}
                    />
                    <SettingsRow
                        title="Block personal email registration by partner"
                        action={<BlockPersonalMailUseDialog />}
                    />
                    <SettingsRow
                        title="Block partners from these countries"
                        action={<RestrictedCountriesDialog />}
                    />
                </SettingsContent>
                <SettingsFooter>
                    {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                </SettingsFooter>
            </Settings>
            <Settings>
                <SettingsHeader>
                    <SettingsTitle>Partner tools</SettingsTitle>
                    <SettingsDescription>Customer visibility, manual leads, and partner-facing integrations.</SettingsDescription>
                </SettingsHeader>
                <SettingsContent>
                    <SettingsRow
                        title="Customer information visibility"
                        description="Control what partners see about your customers"
                        action={<CustomerVisibilityDialog />}
                    />
                </SettingsContent>
                <SettingsFooter>
                    {error && <div className='flex gap-1 items-center text-destructive'><HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} /><Small className='inline text-xs text-destructive'> Error: {error.message}</Small></div>}
                </SettingsFooter>
            </Settings>

        </div>
    )
}
