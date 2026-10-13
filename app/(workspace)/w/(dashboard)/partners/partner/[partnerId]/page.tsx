import { PartnerDetails } from '@rewardkit/modules/partner/partner.details'
import { Suspense } from 'react'

export default async function page() {
    return (
        <Suspense fallback={null}>
            <PartnerDetails />
        </Suspense>
    )
}
