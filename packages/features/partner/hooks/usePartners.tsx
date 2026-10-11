"use client"

import { usePartnerList, type PartnerListFilters } from "./usePartnerList"
import type { PartnerTableStatus } from "../lib/partner.search-params"

export type { PartnerListFilters }

/**
 * Generic partner list. Status comes from the URL (`tab`) when `syncUrl` is on;
 * in local mode the status only applies if it is part of `filters`.
 * For a status-bound list prefer the dedicated hooks
 * (`useActivePartners`, `usePendingPartners`, ...).
 */
export function usePartners({
    status = "active",
    limit = 20,
    enabled = true,
    syncUrl = false,
    filters: initialFilters,
}: {
    status?: PartnerTableStatus
    limit?: number
    enabled?: boolean
    syncUrl?: boolean
    filters?: PartnerListFilters
} = {}) {
    return usePartnerList(status, { limit, enabled, syncUrl, filters: initialFilters })
}
