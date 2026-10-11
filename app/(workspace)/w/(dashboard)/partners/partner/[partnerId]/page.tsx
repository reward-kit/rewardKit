import { PartnerDetails } from '@rewardkit/modules/partner/partner.details'
import { Suspense } from 'react'

export default async function page({ params }: { params: Promise<{ partnerId: string }> }) {
    const { partnerId } = await params
    return (
        <Suspense fallback={null}>
            <PartnerDetails partnerId={partnerId} />
        </Suspense>
    )
}
