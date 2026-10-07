"use client"

import toast from "react-hot-toast"
import { useOrganization } from "@clerk/nextjs"
import { trpc } from "@rewardkit/trpc/react/client"
import type { CreatePartnerGroupInput } from "@rewardkit/packages/types/partner-groups/partner-groups.api.schema"

const REALTIME_REFRESH_INTERVAL = 30_000

/** Runs a mutation promise and returns null on failure (the mutation's onError already toasts). */
const safe = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
        return await fn()
    } catch {
        return null
    }
}

export function usePartnerGroups({ enabled = true }: { enabled?: boolean } = {}) {
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id
    const utils = trpc.useUtils()

    const refreshList = () => utils.partnerGroups.listPartnerGroups.invalidate()

    const list = trpc.partnerGroups.listPartnerGroups.useQuery(undefined, {
        enabled: enabled && !!orgId, // orgProcedure, so it needs an active org
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: REALTIME_REFRESH_INTERVAL,
        retry: 1,
    })

    const create = trpc.partnerGroups.createPartnerGroup.useMutation({
        onError: (err) => {
            console.error("[usePartnerGroups.create]", err)
            toast.error(err.message || "Failed to create group", { id: "partner-group-create" })
        },
        onSuccess: () => {
            refreshList()
            toast.success("Group created", { id: "partner-group-create" })
        },
    })

    const update = trpc.partnerGroups.updatePartnerGroup.useMutation({
        onError: (err) => {
            console.error("[usePartnerGroups.update]", err)
            toast.error(err.message || "Failed to update group", { id: "partner-group-update" })
        },
        onSuccess: () => {
            refreshList()
            toast.success("Group updated", { id: "partner-group-update" })
        },
    })

    const remove = trpc.partnerGroups.deletePartnerGroup.useMutation({
        onError: (err) => {
            console.error("[usePartnerGroups.delete]", err)
            toast.error(err.message || "Failed to delete group", { id: "partner-group-delete" })
        },
        onSuccess: () => {
            refreshList()
            toast.success("Group deleted", { id: "partner-group-delete" })
        },
    })

    const setDefault = trpc.partnerGroups.setDefaultPartnerGroup.useMutation({
        onError: (err) => {
            console.error("[usePartnerGroups.setDefault]", err)
            toast.error(err.message || "Failed to set default group", { id: "partner-group-default" })
        },
        onSuccess: () => {
            // the previous default loses its flag too, so refetch the whole list
            refreshList()
            toast.success("Default group updated", { id: "partner-group-default" })
        },
    })

    // create keeps your { group } wrapper; the rest take the endpoint's input as-is
    const handleCreate = ({ group }: { group: CreatePartnerGroupInput["groupData"] }) =>
        safe(() => create.mutateAsync({ groupData: group }))

    const handleUpdate = (input: Parameters<typeof update.mutateAsync>[0]) =>
        safe(() => update.mutateAsync(input))

    const handleDelete = (input: Parameters<typeof remove.mutateAsync>[0]) =>
        safe(() => remove.mutateAsync(input))

    const handleSetDefault = (input: Parameters<typeof setDefault.mutateAsync>[0]) =>
        safe(() => setDefault.mutateAsync(input))

    return {
        // a disabled query still returns its cached data, so hide old groups once the org is cleared
        partnerGroups: orgId ? (list.data?.partnerGroups ?? []) : [],
        error: list.error,
        isError: list.isError,
        // "loading" also covers the moment before Clerk knows whether there is an org
        isLoading: enabled && (!orgLoaded || list.isLoading),
        refetch: list.refetch,

        create,
        update,
        remove,
        setDefault,

        handleCreate,
        handleUpdate,
        handleDelete,
        handleSetDefault,

        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
        isSettingDefault: setDefault.isPending,
    }
}