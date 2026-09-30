
import { ClerkProvider } from '@clerk/nextjs'
import { env } from '@rewardkit/packages/env'
import React from 'react'

export const ClerkClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider publishableKey={env.clerk.publishableKey} >
            {children}
        </ClerkProvider>
    )
}
