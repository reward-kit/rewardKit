"use client"

import { useQueryState } from 'nuqs'
import { PartnerActiveListTable } from '@rewardkit/packages/features/partner/components/table/partner.active.table'
import { Dashboard, DashboardContent, DashboardHeader, DashboardHeaderAction, DashboardTitle } from '@rewardkit/packages/ui/components/layout/dashboard.layout'
import { PartnerCreateDialog } from './partner.create.dialog'
import { TextInput } from '@rewardkit/packages/ui/components/input/text.input'
import { TableTab, TableTabs } from '@rewardkit/packages/ui/components/table'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { PARTNER_STATUS } from '@rewardkit/packages/types/partner/partner.schema'
import { usePartners } from '@rewardkit/packages/features/partner/hooks/usePartners'
import { partnerTabParser, type PartnerTableStatus } from '@rewardkit/packages/features/partner/lib/partner.search-params'
import { PartnerSuspendedListTable } from '@rewardkit/packages/features/partner/components/table/partner.suspended.table'
import { useActivePartners } from '@rewardkit/packages/features/partner/hooks/useActivePartners'
import { useSuspendedPartners } from '@rewardkit/packages/features/partner/hooks/useSuspendedPartners'
import { useInvitedPartners } from '@rewardkit/packages/features/partner/hooks/useInvitedPartners'
import { usePendingPartners } from '@rewardkit/packages/features/partner/hooks/usePendingPartners'
import { PartnerInvitedListTable } from '@rewardkit/packages/features/partner/components/table/partner.invited.table'
import { PartnerPendingListTable } from '@rewardkit/packages/features/partner/components/table/partner.pending.table'

export const PartnerPage = () => {
  const [tab, setTab] = useQueryState("tab", partnerTabParser)
  const { search, setSearch } = usePartners({ status: tab, syncUrl: true });
  const { total: activeTotal } = useActivePartners({ syncUrl: true })
  const { total: suspendedTotal } = useSuspendedPartners({ syncUrl: true })
  const { total: invitedTotal } = useInvitedPartners({ syncUrl: true })
  const { total: pendingTotal } = usePendingPartners({ syncUrl: true })

  const TABS: TableTab[] = [
    { key: PARTNER_STATUS.ACTIVE, label: "Active", count: activeTotal ?? 0 },
    { key: PARTNER_STATUS.PENDING, label: "Pending", count: pendingTotal ?? 0 },
    { key: PARTNER_STATUS.INVITED, label: "Invited", count: invitedTotal ?? 0 },
    { key: PARTNER_STATUS.SUSPENDED, label: "Suspended", count: suspendedTotal ?? 0 },
  ]

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle className="text-base">Partners</DashboardTitle>
        <DashboardHeaderAction className="top-2 gap-1 flex items-center">
          <div className="w-full">
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Search partner..."
              variant="sm"
              className="sm:max-w-lg w-full h-7.5 rounded-lg truncate shadow-none text-xs/snug"
              autoComplete="off"
              focusRing={false}
              startingIcon={<HugeiconsIcon icon={Search01Icon} size={16} />}
            />
          </div>
          <PartnerCreateDialog />
        </DashboardHeaderAction>
      </DashboardHeader>

      <DashboardContent className="px-0 pt-0">
        <div className="px-3 border-t">
          <TableTabs
            variant="underline"
            value={tab}
            onChange={(v) => setTab(v as PartnerTableStatus)}
            tabs={TABS}
          />
        </div>

        {tab === "active" && <PartnerActiveListTable />}
        {tab === "pending" && <PartnerPendingListTable />}
        {tab === "invited" && <PartnerInvitedListTable />}
        {tab === "suspended" && <PartnerSuspendedListTable />}
      </DashboardContent>
    </Dashboard>
  )
}