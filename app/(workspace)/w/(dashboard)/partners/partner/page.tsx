import { Suspense } from "react"
import { PartnerDetails } from "@rewardkit/modules/partner/partner.details"

export default function Page() {
  return (
    <Suspense fallback={null}>
      {/* <PartnerDetails /> */}
    </Suspense>
  )
}