import { Dashboard, DashboardContent, DashboardHeader } from '@rewardkit/packages/ui/components/layout/dashboard.layout'
import { ProgramClient } from './program.client'

export const ProgramPage = () => {
    return (
        <Dashboard>
            <DashboardHeader>
                <></>
            </DashboardHeader>
            <DashboardContent className='max-w-3xl mx-auto'>
                <ProgramClient />
            </DashboardContent>
        </Dashboard>
    )
}
