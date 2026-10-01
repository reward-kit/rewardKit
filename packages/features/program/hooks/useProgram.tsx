import { apiFetch } from "@rewardkit/packages/server/fetcher";
import { keys } from "@rewardkit/packages/server/keys";
import { ZProgramResource } from "@rewardkit/packages/types/program/program.schema";
import useSWR from "swr";
import z from "zod";

export function usePrograms() {
    const { data, error, isLoading, mutate } = useSWR(keys.programs.list(), (url) =>
        apiFetch(url, undefined, z.array(ZProgramResource))
    );
    return { programs: data, error, isLoading, mutate };
}