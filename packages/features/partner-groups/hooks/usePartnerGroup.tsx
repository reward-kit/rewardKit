"use client"

import { usePartnerGroups } from "./usePartnerGroups"

/** Finds one group from the cached list. Shares the list query, so no extra request. */
export function usePartnerGroup(groupId: string) {
    const { partnerGroups, isLoading, isError, error, refetch } = usePartnerGroups()

    // String() in case ids are numeric in your schema
    const group = partnerGroups.find((g) => String(g.id) === groupId) ?? null

    return {
        group,
        isLoading,
        isError,
        error,
        refetch,
        notFound: !isLoading && !isError && !group,
    }
}