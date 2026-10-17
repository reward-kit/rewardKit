"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useOrganization } from "@clerk/nextjs"
import { keepPreviousData } from "@tanstack/react-query"
import { trpc } from "@rewardkit/trpc/react/client"
import type {
    CreateLinkInput,
    ListLinksInput,
    LinkListItem,
    UpdateLinkInput,
} from "@rewardkit/packages/types/link/link.api.schema"
import { safeAsync } from "@rewardkit/utils/provider/safe"

export type LinkListFilters = Partial<Omit<ListLinksInput, "partnerId" | "page" | "limit">>

export interface UsePartnerLinksOptions {
    /** The partner whose links we are listing / mutating. */
    partnerId?: string
    limit?: number
    /** Set to false to skip the list query and use the hook for mutations only. */
    enabled?: boolean
    filters?: LinkListFilters
}

export function usePartnerLinks({
    partnerId,
    limit = 20,
    enabled = true,
    filters,
}: UsePartnerLinksOptions = {}) {
    const utils = trpc.useUtils()
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(limit)

    const canQuery = enabled && !!orgId && !!partnerId

    const list = trpc.link.listLinks.useQuery(
        { partnerId: partnerId ?? "", page, limit: pageSize, ...filters },
        {
            enabled: canQuery, // orgProcedure, so it needs an active org
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            retry: 1,
            // keep the current page on screen while the next one loads (no flicker)
            placeholderData: keepPreviousData,
        },
    )

    // any mutation changes the set of links for this partner, so refresh that list
    const refreshList = () => utils.link.listLinks.invalidate()

    const create = trpc.link.createLink.useMutation({
        onError: (err) => {
            console.error("[usePartnerLinks.create]", err)
            toast.error(err.message || "Failed to create link", { id: "link-create" })
        },
        onSuccess: () => {
            setPage(1) // a new link shows up first, so jump back to page 1
            refreshList()
            toast.success("Link created", { id: "link-create" })
        },
    })

    const update = trpc.link.updateLink.useMutation({
        onError: (err) => {
            console.error("[usePartnerLinks.update]", err)
            toast.error(err.message || "Failed to update link", { id: "link-update" })
        },
        onSuccess: () => {
            refreshList()
            toast.success("Link updated", { id: "link-update" })
        },
    })

    const remove = trpc.link.deleteLink.useMutation({
        onError: (err) => {
            console.error("[usePartnerLinks.delete]", err)
            toast.error(err.message || "Failed to delete link", { id: "link-delete" })
        },
        onSuccess: () => {
            refreshList()
            toast.success("Link deleted", { id: "link-delete" })
        },
    })

    const handleCreate = (linkData?: CreateLinkInput["linkData"]) =>
        safeAsync(() => create.mutateAsync({ partnerId: partnerId ?? "", linkData }))

    const handleUpdate = (input: UpdateLinkInput) =>
        safeAsync(() => update.mutateAsync(input))

    const handleDelete = (input: { partnerId?: string; linkId: string }) =>
        safeAsync(() => remove.mutateAsync({ partnerId: input.partnerId ?? partnerId ?? "", linkId: input.linkId }))

    return {
        // a disabled query still returns its cached data, so hide rows unless this hook is actually querying
        links: canQuery ? ((list.data?.data ?? []) as LinkListItem[]) : [],
        total: list.data?.total ?? 0,
        page,
        pageSize,
        totalPages: list.data?.totalPages ?? 1,
        hasNextPage: list.data?.hasNextPage ?? false,
        hasPrevPage: list.data?.hasPrevPage ?? false,
        setPage,
        setPageSize,

        error: list.error,
        isError: list.isError,
        // "loading" also covers the moment before Clerk knows whether there is an org
        isLoading: canQuery && (!orgLoaded || list.isLoading),
        isFetching: list.isFetching,
        refetch: list.refetch,

        create,
        update,
        remove,
        handleCreate,
        handleUpdate,
        handleDelete,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
    }
}