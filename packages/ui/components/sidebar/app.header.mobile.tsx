import { SidebarUserClient } from './sidebar.user.client'
import { auth } from '@clerk/nextjs/server'
import { H3 } from '@rewardkit/packages/ui/components/typography'
import { Image } from '../image'
import { SidebarTrigger } from '../sidebar'

export const AppHeaderMobile = async ({ pageTitle, enableSidebarTrigger = false }: { pageTitle?: string, enableSidebarTrigger?: boolean }) => {
    const { userId } = await auth()

    if (!userId) return null
    return (
        <div className="h-14 inline md:hidden w-full shrink-0 border-b border-border-1/70 bg-background px-4">
            <div className='flex items-center justify-between w-full h-full'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1 border p-1 bg-white/92 rounded-lg'>
                        <Image src={"/svg/rewardkit.svg"} priority className="w-28" alt="RewardKit" />

                        {enableSidebarTrigger && <SidebarTrigger className={"p-0 size-6"} />}
                    </div>
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

