import { FooterComponent } from '@rewardkit/packages/ui/components/footer/footer.component'
import { HeaderComponent } from '@rewardkit/packages/ui/components/header/header.component'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <HeaderComponent />
            {children}
            <FooterComponent />
        </div>
    )
}
