import { AppHeader } from '@rewardkit/packages/ui/components/sidebar/app.header'
import { AppHeaderMobile } from '@rewardkit/packages/ui/components/sidebar/app.header.mobile'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen overflow-x-hidden h-svh flex-col [--header-height:3rem]">
            <div className='flex h-full w-full'>
                <div className='md:w-1/2 hidden md:flex bg-[#FBF4EB]'></div>
                <div className='md:w-1/2 pt-18'>{children}</div>
            </div>
        </div>
    )
}