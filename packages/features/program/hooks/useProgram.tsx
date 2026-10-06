"use client"

import toast from "react-hot-toast"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { trpc } from "@rewardkit/trpc/react/client"
import { useOrganization } from "@clerk/nextjs"

const REALTIME_REFRESH_INTERVAL = 30_000;

export function useProgram({ enabled = true }: { enabled?: boolean } = {}) {
    const { organization, isLoaded: orgLoaded } = useOrganization()
    const orgId = organization?.id
    const utils = trpc.useUtils()

    const current = trpc.program.getCurrentProgram.useQuery(undefined, {
        enabled: enabled && !!orgId, // getCurrentProgram is an orgProcedure, so it needs an active org
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: REALTIME_REFRESH_INTERVAL,
        retry: 1,
    })

    const programs = trpc.program.listPrograms.useQuery(undefined, {
        enabled,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: REALTIME_REFRESH_INTERVAL,
        retry: 1,
    })

    const update = trpc.program.updateProgram.useMutation({
        onError: (err, _vars) => {
            console.error("[useProgram.handleUpdate]", err)
            toast.error("Failed to update program", { id: "program-update" })
        },
        onSuccess: () => {
            utils.program.getCurrentProgram.invalidate()
            utils.program.listPrograms.invalidate()
            toast.success("Program updated", { id: "program-update" })
        },
    })

    const create = trpc.program.createProgram.useMutation({
        onError: (err, _vars) => {
            console.error("[useProgram.handleCreate]", err)
        },
        onSuccess: () => {
            utils.program.getCurrentProgram.invalidate()
        },
    })

    const remove = trpc.program.deleteProgram.useMutation({
        onError: (err) => {
            console.error("[useProgram.handleDelete]", err)
            toast.error("Failed to delete program", { id: "program-delete" })
        },
    })

    const handleDelete = async (programId: string) => {
        try {
            await remove.mutateAsync({ programId })
            return true
        } catch {
            return false
        }
    }

    const handleUpdate = async ({ programId, program }: { programId: string, program: Partial<ProgramResource> }) => {
        try {
            return await update.mutateAsync({
                programId,
                programData: program,
            })
        } catch {
            return null
        }
    }

    const handleCreate = async ({ program }: { program: ProgramResource }) => {
        try {
            return await create.mutateAsync({
                programData: program,
            })
        } catch {
            return null
        }
    }

    return {
        // a disabled query still returns its cached data, so hide the old program once the org is cleared
        program: orgId ? current.data?.program : undefined,
        error: current.error,
        isError: current.isError,
        // "loading" also covers the moment before Clerk knows whether there is an org
        isLoading: enabled && (!orgLoaded || current.isLoading),
        isUpdating: update.isPending,
        refetch: current.refetch,
        handleUpdate,
        update,
        create,
        handleCreate,
        remove,
        handleDelete,
        programs,
    }
}

const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export function useCheckSubdomain(subdomain: string) {
    const normalized = subdomain.trim().toLowerCase()
    const isValidFormat = normalized.length >= 3 && SUBDOMAIN_REGEX.test(normalized)

    const query = trpc.program.checkSubdomain.useQuery(
        { subdomain: normalized },
        {
            enabled: isValidFormat,
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 10_000,
        }
    )

    return {
        isChecking: isValidFormat && query.isFetching,
        isAvailable: isValidFormat ? query.data?.available === true : undefined,
        reason: query.data?.reason ?? null,
        isValidFormat,
    }
}