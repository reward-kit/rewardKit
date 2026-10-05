import { SidebarUserClient } from './sidebar.user.client'
import { auth } from '@clerk/nextjs/server'
import { H3 } from '@rewardkit/packages/ui/components/typography'
import { Image } from '../image'
import { SidebarTrigger } from '../sidebar'

export const AppHeader = async ({ pageTitle }: { pageTitle?: string }) => {
    const { userId } = await auth()

    if (!userId) return null
    return (
        <div className="h-(--header-height) hidden md:inline w-screen shrink-0 border-b border-border-1/70 bg-background px-4">
            <div className='flex items-center justify-between w-full h-full'>
                <div className='flex items-center gap-3'>
                    <Image src={"/svg/rewardkit.svg"} priority className="w-28" alt="RewardKit" />

                    {/* <div className='md:hidden'><SidebarTrigger /></div> */}
                    <div className='md:hidden w-px h-4 bg-border' />
                    <div>
                        <H3 className='font-inter! md:text-[1rem] font-semibold! tracking-tight text-foreground'>{pageTitle}</H3>
                    </div>
                </div>

                <div>
                    <SidebarUserClient />
                </div>
            </div>
        </div>
    )
}

