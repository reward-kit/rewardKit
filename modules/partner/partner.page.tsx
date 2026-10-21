"use client"

import { useQueryState } from 'nuqs'
import { PartnerActiveListTable } from '@rewardkit/packages/features/partner/components/table/partner.active.table'
import { Dashboard, DashboardContent, DashboardHeader, DashboardHeaderAction, DashboardTitle } from '@rewardkit/packages/ui/components/layout/dashboard.layout'
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
import { CreatePartnerModal } from '@rewardkit/packages/features/partner/components/create-partner/create-partner.modal'
import { Button } from '@rewardkit/packages/ui/components/button'
import { IconInnerShadowBottomRightFilled } from '@tabler/icons-react'
import { useState } from 'react'

export const PartnerPage = () => {
  const [tab, setTab] = useQueryState("tab", partnerTabParser)
  const { search, setSearch } = usePartners({ status: tab, syncUrl: true });
  const { total: activeTotal } = useActivePartners({ syncUrl: true })
  const { total: suspendedTotal } = useSuspendedPartners({ syncUrl: true })
  const { total: invitedTotal } = useInvitedPartners({ syncUrl: true })
  const { total: pendingTotal } = usePendingPartners({ syncUrl: true })
  const [openCreateModal, setOpenCreateModal] = useState(false)

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
        <DashboardHeaderAction className="top-2.5 gap-1 flex items-center">
          <div className="w-full">
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Search partner..."
              variant="sm"
              className="sm:max-w-lg w-full rounded-lg truncate shadow-none text-xs/snug"
              autoComplete="off"
              focusRing={false}
              startingIcon={<HugeiconsIcon icon={Search01Icon} size={16} />}
            />
          </div>
          <Button variant="secondary" size="sm" className="rounded-[12px] pr-2.25! px-2" onClick={() => setOpenCreateModal(true)}>
            <IconInnerShadowBottomRightFilled />
            Create partner
          </Button>
          <CreatePartnerModal open={openCreateModal} onOpenChange={setOpenCreateModal} />
        </DashboardHeaderAction>
      </DashboardHeader>

      <DashboardContent>
        <TableTabs
          value={tab}
          onChange={(v) => setTab(v as PartnerTableStatus)}
          tabs={TABS}
        />

        <div className='pt-6'>
          {tab === "active" && <PartnerActiveListTable />}
          {tab === "pending" && <PartnerPendingListTable />}
          {tab === "invited" && <PartnerInvitedListTable />}
          {tab === "suspended" && <PartnerSuspendedListTable />}
        </div>
      </DashboardContent>
    </Dashboard>
  )
}