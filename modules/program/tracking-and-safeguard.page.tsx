"use client"
import { Settings, SettingsContent, SettingsDescription, SettingsHeader, SettingsRow, SettingsTitle } from '@rewardkit/packages/ui/components/layout/settings.layout'
import { CookieDurationEditDialog } from './attribution/cookie-duration.dialog'
import { URLParameterDialog } from './attribution/url-parameter.dialog'
import { SelfReferDialog } from './referral-safeguards/self-refer.dialog'
import { BlockPersonalMailUseDialog } from './referral-safeguards/block-personal-mail-use.dialog'
import { RestrictedCountriesDialog } from './referral-safeguards/restrict-countries.dialog'
import { CustomerVisibilityDialog } from './partner-tools/customer-identity.dialog'
import { Dashboard, DashboardContent, DashboardHeader, DashboardTitle } from '@rewardkit/packages/ui/components/layout/dashboard.layout'

export const TrackingAndSafeguardPage = () => {

    return (
        <Dashboard className='max-w-2xl mx-auto'>
            <DashboardHeader className='px-7'>
                <DashboardTitle>Tracking and safeguards</DashboardTitle>
            </DashboardHeader>
            <DashboardContent>
                <div className='grid grid-cols-1 gap-6'>
                    <Settings>
                        <SettingsHeader>
                            <SettingsTitle>Attribution tracking</SettingsTitle>
                            <SettingsDescription>Cookies, links, URL parameters, and the program-wide coupon partners share.</SettingsDescription>
                        </SettingsHeader>
                        <SettingsContent>
                            <SettingsRow
                                title="Cookie duration"
                                description="Expiration of cookie"
                                action={<CookieDurationEditDialog />}
                            />
                            <SettingsRow
                                title="URL parameters"
                                description="URL parameters that you want to allow your partners to use."
                                action={<URLParameterDialog />}
                            />
                        </SettingsContent>
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
                    </Settings>

                </div>
            </DashboardContent>
        </Dashboard>
    )
}
