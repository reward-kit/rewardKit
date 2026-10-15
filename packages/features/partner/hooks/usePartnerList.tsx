"use client"

import { useEffect, useState } from "react"
import { useOrganization } from "@clerk/nextjs"
import { useQueryStates } from "nuqs"
import { trpc } from "@rewardkit/trpc/react/client"
import type { ListPartnersInput, PartnerStatusCounts } from "@rewardkit/packages/types/partner/partner.api.schema"
import type { PartnerStatus } from "@rewardkit/packages/types/partner/partner.schema"
import { PARTNER_SORT_FIELDS, PARTNER_URL_KEYS, partnerTableParsers, PartnerTableStatus } from "../lib/partner.search-params"
import { useDebounce } from "@rewardkit/hooks/useDebounce"

export const EMPTY_STATUS_COUNTS: PartnerStatusCounts = {
    active: 0,
    pending: 0,
    invited: 0,
    suspended: 0,
    rejected: 0,
}

export type PartnerListFilters = Omit<ListPartnersInput, "page" | "limit">

export interface UsePartnerListOptions {
    limit?: number
    enabled?: boolean
    syncUrl?: boolean
    filters?: PartnerListFilters
    /**
     * Status to force on the query even when `syncUrl` is off.
     * The per-status hooks pass their own status so local (non-URL) usage is
     * filtered too; the generic `usePartners` leaves it undefined for back-compat.
     */
    boundStatus?: PartnerStatus
}

export function usePartnerList(
    status: PartnerTableStatus,
    { limit = 20, enabled = true, syncUrl = false, filters: initialFilters, boundStatus }: UsePartnerListOptions = {},
) {
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id

    // local state (used when syncUrl is false)
    const [localFilters, setLocalFilters] = useState<PartnerListFilters>(initialFilters ?? {})
    const [localPage, setLocalPage] = useState(1)

    // URL state (used when syncUrl is true)
    const [url, setUrl] = useQueryStates(partnerTableParsers, {
        urlKeys: PARTNER_URL_KEYS[status],
        clearOnDefault: false,
    })

    const debouncedSearch = useDebounce(url.search)

    const pageSize = syncUrl ? url.pageSize : limit
    const page = syncUrl ? url.page : localPage
    const filters: PartnerListFilters = syncUrl
        ? { status, search: debouncedSearch || undefined, groupId: url.groupId ?? undefined, sortBy: url.sortBy, desc: url.desc }
        : { ...localFilters, ...(boundStatus ? { status: boundStatus } : {}) }

    useEffect(() => {
        if (!syncUrl) return
        setUrl(url)            // writes every key, defaults included
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const list = trpc.partner.listPartners.useQuery(
        {
            ...filters,
            page,
            limit: pageSize,
            ...(syncUrl && { sortBy: url.sortBy, desc: url.desc }),
        },
        {
            enabled: enabled && !!orgId,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            retry: 1,
        },
    )

    // counts are status-agnostic: same search/group filters as the list
    const countsQuery = trpc.partner.partnerCounts.useQuery(
        { search: filters.search, groupId: filters.groupId },
        {
            enabled: enabled && !!orgId,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            retry: 1,
        },
    )

    // any filter change restarts pagination
    const updateFilters = (next: Partial<PartnerListFilters>) => {
        if (syncUrl) {
            setUrl({
                ...("search" in next && { search: next.search ?? "" }),
                ...("groupId" in next && { groupId: next.groupId ?? null }),
                page: 1,
            })
        } else {
            setLocalFilters((prev) => ({ ...prev, ...next }))
            setLocalPage(1)
        }
    }

    const setPage = (p: number) => (syncUrl ? setUrl({ page: p }) : setLocalPage(p))
    const setPageSize = (n: number) => setUrl({ pageSize: n, page: 1 })
    const setSort = (sortBy: (typeof PARTNER_SORT_FIELDS)[number], desc: boolean) => setUrl({ sortBy, desc, page: 1 })

    const total = list.data?.total ?? 0
    const totalPages = list.data?.totalPages ?? 1

    return {
        status,
        partners: orgId ? (list.data?.data ?? []) : [],
        counts: countsQuery.data?.counts ?? EMPTY_STATUS_COUNTS,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: list.data?.hasNextPage ?? false,
        hasPrevPage: list.data?.hasPrevPage ?? false,
        filters,
        updateFilters,
        setPage,
        pageSize, setPageSize, sortBy: url.sortBy, desc: url.desc, setSort,
        search: url.search, setSearch: (v: string) => setUrl({ search: v, page: 1 }),

        error: list.error,
        isError: list.isError,
        isLoading: enabled && (!orgLoaded || list.isLoading),
        isFetching: list.isFetching,
        refetch: list.refetch,
    }
}
