import React from 'react'
import { ClerkClientProvider } from './clerk.provider'
import { TooltipProvider } from '@rewardkit/packages/ui/components/tooltip'
import { TRPCProviders } from './trpc.provider'

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkClientProvider>
            <TRPCProviders>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </TRPCProviders>
        </ClerkClientProvider>
    )
}
