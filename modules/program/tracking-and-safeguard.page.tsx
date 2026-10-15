"use client"
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { ProgramCookieDurationCard } from '@rewardkit/packages/features/program/components/program-cookie-duration/program-cookie-duration.card'
import { ProgramUrlParamsCard } from '@rewardkit/packages/features/program/components/program-url-params/program-url-params.card'
import { ProgramBlockSelfReferralsCard } from '@rewardkit/packages/features/program/components/program-block-self-referrals/program-block-self-referrals.card'
import { ProgramRestrictPersonalEmailCard } from '@rewardkit/packages/features/program/components/program-restrict-personal-email/program-restrict-personal-email.card'
import { ProgramRestrictCountriesCard } from '@rewardkit/packages/features/program/components/program-restrict-countries/program-restrict-countries.card'
import { ProgramCustomerVisibilityCard } from '@rewardkit/packages/features/program/components/program-customer-visibility/program-customer-visibility.card'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { Dashboard, DashboardContent } from '@rewardkit/packages/ui/components/layout/dashboard.layout'

export const TrackingAndSafeguardPage = () => {
    const { program, isLoading, error } = useProgram();

    return (
        <Dashboard className='max-w-190 px-4 mx-auto'>
            <DashboardContent isLoading={isLoading}>
                {error && (
                    <div className='mb-4 flex gap-1 items-center text-destructive'>
                        <HugeiconsIcon strokeWidth={2} size={13} icon={AlertCircleIcon} />
                        <Small className='inline text-xs text-destructive'>Error: {error.message}</Small>
                    </div>
                )}

                {program && (
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
                        <ProgramCookieDurationCard program={program} />
                        <ProgramUrlParamsCard program={program} />
                        <ProgramBlockSelfReferralsCard program={program} />
                        <ProgramRestrictPersonalEmailCard program={program} />
                        <ProgramRestrictCountriesCard program={program} />
                        <ProgramCustomerVisibilityCard program={program} />
                    </div>
                )}
            </DashboardContent>
        </Dashboard>
    )
}
