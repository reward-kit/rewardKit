"use client"

import { usePartnerList, type PartnerListFilters } from "./usePartnerList"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"

export type { PartnerListFilters }

export function useSuspendedPartners({
    limit = 20,
    enabled = true,
    syncUrl = false,
    filters: initialFilters,
}: {
    limit?: number
    enabled?: boolean
    syncUrl?: boolean
    filters?: PartnerListFilters
} = {}) {
    return usePartnerList("suspended", {
        limit,
        enabled,
        syncUrl,
        filters: initialFilters,
        boundStatus: PARTNER_STATUS.SUSPENDED,
    })
}
