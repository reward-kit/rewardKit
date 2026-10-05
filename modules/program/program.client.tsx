"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rewardkit/packages/ui/components/tabs'
import { useUrlTab } from '@rewardkit/hooks/useUrlTab'
import { GeneralSettingsTab } from './general-settings.tab'
import { TrackingAndSafeguardTab } from './tracking-and-safeguard.tab'

const TABS = [
    { value: 'general-settings', label: 'General Settings' },
    { value: 'tracking-and-safeguard', label: 'Tracking & Safeguard' },
] as const

export const ProgramClient = () => {
    const [tab, setTab] = useUrlTab(TABS.map((t) => t.value))

    return (
        <Tabs value={tab} onValueChange={setTab}>
            <div>
                <TabsList>
                    {TABS.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <TabsContent value={"general-settings"}>
                    <GeneralSettingsTab />
            </TabsContent>
            <TabsContent value={"tracking-and-safeguard"}>
                    <TrackingAndSafeguardTab />
            </TabsContent>
        </Tabs>
    )
}