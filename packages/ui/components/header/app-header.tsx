import { auth } from '@clerk/nextjs/server'
import { Image } from '../image'
import { HeaderNavClient } from './app-header.nav.client'
import { SidebarUserClient } from '../sidebar/sidebar.user.client'

export const AppHeader = async () => {
    const { userId } = await auth()

    if (!userId) return null
    return (
        <div className="h-(--header-height) sticky top-0 z-20 hidden md:block w-screen shrink-0 border-b bg-sidebar px-4">
            <div className="flex justify-between items-center w-full h-full">
                {/* Left: logo + page title */}
                <div className="flex items-center gap-3">
                    <Image src={"/svg/rewardkit.svg"} priority className="w-28" alt="RewardKit" />

                    <HeaderNavClient />
                </div>

                {/* Right: user menu */}
                <div className="flex gap-8 justify-end">
                    <SidebarUserClient />
                </div>
            </div>
        </div>
    )
}