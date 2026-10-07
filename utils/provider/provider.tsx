import React from 'react'
import { ClerkClientProvider } from './clerk.provider'
import { TooltipProvider } from '@rewardkit/packages/ui/components/tooltip'
import { TRPCProviders } from './trpc.provider'
import { SwrProvider } from '@rewardkit/packages/server/swr.provider'
import { Toaster } from 'react-hot-toast';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkClientProvider>
                <TRPCProviders>
                    <SwrProvider>
                        <TooltipProvider>
                            <Toaster />
                            {children}
                        </TooltipProvider>
                    </SwrProvider>
                </TRPCProviders>
        </ClerkClientProvider>
    )
}
