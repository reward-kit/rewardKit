import React from 'react'
import { ClerkClientProvider } from './clerk.provider'
import { TooltipProvider } from '@rewardkit/packages/ui/components/tooltip'
import { SwrProvider } from '@rewardkit/packages/server/swr.provider'

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkClientProvider>
            <SwrProvider>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </SwrProvider>
        </ClerkClientProvider>
    )
}
