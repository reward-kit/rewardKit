import React from 'react'
import { ClerkClientProvider } from './clerk.provider'
import { TooltipProvider } from '@rewardkit/packages/ui/components/tooltip'

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkClientProvider>
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </ClerkClientProvider>
    )
}
