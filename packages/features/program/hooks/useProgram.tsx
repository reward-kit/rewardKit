"use client"

import toast from "react-hot-toast"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { trpc } from "@rewardkit/trpc/react/client"

const REALTIME_REFRESH_INTERVAL = 30_000;

export function useProgram() {
    const utils = trpc.useUtils()

    const { data: program, error, isError, isLoading, refetch } = trpc.program.getCurrentProgram.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: REALTIME_REFRESH_INTERVAL,
        // throwOnError: false,
        retry: 1,
    })

    const programs = trpc.program.listPrograms.useQuery(undefined, {
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
            toast.success("Program updated", { id: "program-update" })
        },
    })

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
    return {
        program: program?.program,
        error,
        isError,
        isLoading,
        isUpdating: update.isPending,
        refetch,
        handleUpdate,
        update,
        programs
    }
}