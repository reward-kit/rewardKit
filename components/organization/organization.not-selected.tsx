import { SidebarProgramClient } from '@rewardkit/packages/ui/components/sidebar/sidebar.program.client'
import { H3 } from '@rewardkit/packages/ui/components/typography'

export const OrganizationNotSelected = async () => {
    return (
        <div className='w-[calc(80vw-10px)] flex flex-col justify-center items-center h-[calc(50vh-200px)]'>
            <div className='flex flex-col gap-4'>
                <H3>Select a program</H3>
                <SidebarProgramClient />
            </div>
        </div>
    )
}
