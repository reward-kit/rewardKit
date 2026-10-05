"use client"

import { useAuth } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@rewardkit/trpc/react/client"
import { useState } from "react"
import { httpBatchLink, TRPCClientError } from "@trpc/client"
import { generateId } from "@rewardkit/lib/id/generateId"

const isServerError = (error: unknown) =>
    error instanceof TRPCClientError && (error.data?.httpStatus ?? 0) >= 500



export function TRPCProviders({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth()

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        throwOnError: isServerError, // 4xx stay in your components
                        retry: (failureCount, error) => {
                            const status = (error as TRPCClientError<any>).data?.httpStatus
                            if (status && status >= 400 && status < 500) return false
                            return failureCount < 2
                        },
                    },
                },
            })
    )
    
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `/api/v1/trpc`,
                    async headers() {
                        const token = await getToken()
                        return {
                            "x-request-id": generateId("req"),
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        }
                    },
                }),
            ],
        })
    )

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}
