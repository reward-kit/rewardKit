"use client";

import { SWRConfig } from "swr";
import { apiFetch, ApiError } from "./fetcher";
import { logger } from "./middleware";

export function SwrProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                fetcher: (url: string) => apiFetch(url),
                use: [logger],
                revalidateOnFocus: false,
                shouldRetryOnError: true,
                onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
                    if (error instanceof ApiError && error.status < 500) return; // don't retry 4xx
                    if (retryCount >= 3) return;
                    setTimeout(() => revalidate({ retryCount }), 2000 * (retryCount + 1));
                },
            }}
        >
            {children}
        </SWRConfig>
    );
}