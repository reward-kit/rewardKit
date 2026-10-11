"use client"

import { useOrganization } from "@clerk/nextjs"
import { useQueryStates } from "nuqs"
import { trpc } from "@rewardkit/trpc/react/client"
import { useDebounce } from "@rewardkit/hooks/useDebounce"
import { PARTNER_URL_KEYS, partnerTableParsers, type PartnerTableStatus } from "../lib/partner.search-params"
import { EMPTY_STATUS_COUNTS, type PartnerListFilters } from "./usePartnerList"

const REALTIME_REFRESH_INTERVAL = 30_000

/**
 * Per-status partner counts for the current filters.
 * Reads the filters from the URL when `syncUrl` is on, otherwise from `filters`.
 */
export function usePartnerCounts({
    status = "active",
    enabled = true,
    syncUrl = false,
    filters,
}: {
    status?: PartnerTableStatus
    enabled?: boolean
    syncUrl?: boolean
    filters?: PartnerListFilters
} = {}) {
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id

    const [url] = useQueryStates(partnerTableParsers, {
        urlKeys: PARTNER_URL_KEYS[status],
        clearOnDefault: false,
    })
    const debouncedSearch = useDebounce(url.search)

    const input = syncUrl
        ? { search: debouncedSearch || undefined, groupId: url.groupId ?? undefined }
        : { search: filters?.search, groupId: filters?.groupId }

    const query = trpc.partner.partnerCounts.useQuery(input, {
        enabled: enabled && !!orgId,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: REALTIME_REFRESH_INTERVAL,
        retry: 1,
    })

    const counts = query.data?.counts ?? EMPTY_STATUS_COUNTS
    const total = counts.active + counts.pending + counts.invited + counts.suspended + counts.rejected

    return {
        counts,
        total,
        error: query.error,
        isError: query.isError,
        isLoading: enabled && (!orgLoaded || query.isLoading),
        isFetching: query.isFetching,
        refetch: query.refetch,
    }
}
