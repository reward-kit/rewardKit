import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '../sidebar'
import { Image } from '../image'
import { FooterSidebarClient } from './footer.sidebar.client'

export const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader>
                <Image src={"/svg/rewardkit.svg"} priority className="w-32" alt="RewardKit" />
            </SidebarHeader>
            <SidebarContent>

            </SidebarContent>
            <SidebarFooter>
                <div>
                    <FooterSidebarClient />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
