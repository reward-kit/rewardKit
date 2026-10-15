"use client"
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { ProgramPayoutMinimumThresholdCard } from '@rewardkit/packages/features/program/components/program-payout-minimum-threshold/program-payout-minimum-threshold.card'
import { ProgramPayoutTermCard } from '@rewardkit/packages/features/program/components/program-payout-term/program-payout-term.card'
import { ProgramPayoutMethodsCard } from '@rewardkit/packages/features/program/components/program-payout-methods/program-payout-methods.card'
import { Small } from '@rewardkit/packages/ui/components/typography'
import { Dashboard, DashboardContent } from '@rewardkit/packages/ui/components/layout/dashboard.layout'

export const PayoutSettingsPage = () => {
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
                        <ProgramPayoutMinimumThresholdCard program={program} />
                        <ProgramPayoutTermCard program={program} />
                        <ProgramPayoutMethodsCard program={program} />
                    </div>
                )}
            </DashboardContent>
        </Dashboard>
    )
}
