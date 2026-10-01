"use client"

import { useAuth } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@rewardkit/trpc/react/client"
import { useState } from "react"
import { httpBatchLink } from "@trpc/client"

export function TRPCProviders({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth()
    const [queryClient] = useState(() => new QueryClient())

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `/api/v1/trpc`,
                    async headers() {
                        const token = await getToken()
                        return token
                            ? { Authorization: `Bearer ${token}` }
                            : {}
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