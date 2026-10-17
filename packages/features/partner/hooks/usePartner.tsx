"use client"

import toast from "react-hot-toast"
import { useOrganization } from "@clerk/nextjs"
import { trpc } from "@rewardkit/trpc/react/client"
import type {
    CreatePartnerInput,
} from "@rewardkit/packages/types/partner/partner.api.schema"
import { safeAsync } from "@rewardkit/utils/provider/safe"

export function usePartner(partnerId?: string, { enabled = true }: { enabled?: boolean } = {}) {
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id
    const utils = trpc.useUtils()

    const refresh = () => {
        utils.partner.listPartners.invalidate()
        utils.partner.getPartner.invalidate()
    }

    const current = trpc.partner.getPartner.useQuery(
        { partnerId: partnerId ?? "" },
        {
            enabled: enabled && !!orgId && !!partnerId, // orgProcedure, so it needs an active org
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            retry: 1,
        },
    )

    const create = trpc.partner.createPartner.useMutation({
        onError: (err) => {
            console.error("[usePartner.create]", err)
            toast.error(err.message || "Failed to create partner", { id: "partner-create" })
        },
        onSuccess: () => {
            refresh()
            toast.success("Partner created", { id: "partner-create" })
        },
    })

    const update = trpc.partner.updatePartner.useMutation({
        onError: (err) => {
            console.error("[usePartner.update]", err)
            toast.error(err.message || "Failed to update partner", { id: "partner-update" })
        },
        onSuccess: () => {
            refresh()
            toast.success("Partner updated", { id: "partner-update" })
        },
    })

    const changeStatus = trpc.partner.changePartnerStatus.useMutation({
        onError: (err) => {
            console.error("[usePartner.changeStatus]", err)
            toast.error(err.message || "Failed to change partner status", { id: "partner-status" })
        },
        onSuccess: () => {
            refresh()
            toast.success("Partner status updated", { id: "partner-status" })
        },
    })

    const remove = trpc.partner.deletePartner.useMutation({
        onError: (err) => {
            console.error("[usePartner.delete]", err)
            toast.error(err.message || "Failed to delete partner", { id: "partner-delete" })
        },
        onSuccess: () => {
            refresh()
            toast.success("Partner deleted", { id: "partner-delete" })
        },
    })

    // create keeps your { partner } wrapper; the rest take the endpoint's input as-is
    const handleCreate = ({ partner }: { partner: CreatePartnerInput["partnerData"] }) =>
        safeAsync(() => create.mutateAsync({ partnerData: partner }))

    const handleUpdate = (input: Parameters<typeof update.mutateAsync>[0]) =>
        safeAsync(() => update.mutateAsync(input))

    const handleChangeStatus = (input: Parameters<typeof changeStatus.mutateAsync>[0]) =>
        safeAsync(() => changeStatus.mutateAsync(input))

    const handleDelete = (input: Parameters<typeof remove.mutateAsync>[0]) =>
        safeAsync(() => remove.mutateAsync(input))

    return {
        // a disabled query still returns its cached data, so hide the old partner once the org is cleared
        partner: orgId && partnerId ? (current.data?.partner ?? null) : null,
        error: current.error,
        isError: current.isError,
        // "loading" also covers the moment before Clerk knows whether there is an org
        isLoading: enabled && (!orgLoaded || (!!partnerId && current.isLoading)),
        refetch: current.refetch,

        create,
        update,
        changeStatus,
        remove,

        handleCreate,
        handleUpdate,
        handleChangeStatus,
        handleDelete,

        isCreating: create.isPending,
        isUpdating: update.isPending,
        isChangingStatus: changeStatus.isPending,
        isDeleting: remove.isPending,
    }
}
