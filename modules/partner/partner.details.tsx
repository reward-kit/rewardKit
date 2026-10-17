"use client"

import { getCountry } from "@rewardkit/lib/countries"
import { PartnerActiveListTable } from "@rewardkit/packages/features/partner/components/table/partner.active.table"
import { PartnerLinksTable } from "@rewardkit/packages/features/link/components/table/partner.links.table"
import { useActivePartnerId } from "@rewardkit/packages/features/partner/hooks/useActivePartnerId"
import { usePartner } from "@rewardkit/packages/features/partner/hooks/usePartner"
import { partnersHref } from "@rewardkit/packages/features/partner/lib/partner.search-params"
import { Dashboard, DashboardContent } from "@rewardkit/packages/ui/components/layout/dashboard.layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rewardkit/packages/ui/components/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"
import { Badge } from "@rewardkit/components/reui/badge"
import { PARTNER_STATUS_STYLE } from "@rewardkit/packages/features/partner/contants/status"
import React from "react"
import { PartnerDetail, PartnerDetailLeftPanel, PartnerDetailProfileCard, PartnerDetailRightPanel } from "@rewardkit/packages/features/partner/components/layout/partner.detail.layout"
import { EditPayoutMethodModal } from "@rewardkit/packages/features/partner/components/payout-method/payout-method.modal"
import { EditPartnerStatusModal } from "@rewardkit/packages/features/partner/components/partner-status/partner-status.model"
import { PartnerStatusCard } from "@rewardkit/packages/features/partner/components/partner-status/partner-status.card"
import { PayoutMethodCard } from "@rewardkit/packages/features/partner/components/payout-method/payout-method.card"
import { isAdminStatus } from "@rewardkit/packages/features/partner/lib/status.lib"
import { PartnerPayoutThresholdCard } from "@rewardkit/packages/features/partner/components/payout-minimum-threshold/payout-minimum-threshold.card"
import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { usePartnerLinks } from "@rewardkit/packages/features/link/hooks/usePartnerLinks"

export const PartnerDetails = () => {
    const activeId = useActivePartnerId()
    const partnerId = activeId ?? ""
    const { partner, isLoading, handleDelete, remove } = usePartner(partnerId)
    const { program } = useProgram();
    const { total } = usePartnerLinks({ partnerId })
    const [editPayout, setEditPayout] = React.useState(false)
    const [editPartnerStatus, setEditPartnerStatus] = React.useState(false)

    const qs = useSearchParams().toString()
    const backHref = qs ? `/w/partners?${qs}` : partnersHref()
    const router = useRouter()

    const country = partner && getCountry(partner?.countryCode)


    return (
        <Dashboard>
            {/* <DashboardHeader>
                <Link className="flex items-center gap-1 text-sm" href={backHref} >
                    <ChevronLeft className="size-4" />
                    Partners
                </Link>
            </DashboardHeader> */}
            <DashboardContent isLoading={isLoading} className="py-0 px-0">
                <PartnerDetail>
                    <PartnerDetailLeftPanel>
                        <PartnerDetailProfileCard
                            avatarSeed={partnerId}
                            firstName={partner?.firstName}
                            lastName={partner?.lastName}
                            email={partner?.email}
                            status={partner?.status}
                            statusHint={PARTNER_STATUS_STYLE[partner?.status ?? PARTNER_STATUS.PENDING].hint}
                            countryName={country?.name}
                            companyName={partner?.companyName}
                        />
                        {/* <PartnerDetailMetricsCard metrics={overviewMetrics} /> */}
                    </PartnerDetailLeftPanel>

                    <PartnerDetailRightPanel>
                        <Tabs className="w-full">
                            {/* tab bar scrolls sideways on narrow screens instead of truncating */}
                            <div className="w-full border-b">
                                <div className="max-w-5xl mx-auto overflow-x-auto pl-3">
                                    <TabsList variant="line" className="pb-0 gap-8 justify-start">
                                        <TabsTrigger className="pb-0" value="customers">Customers</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="commissions">Commissions</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="transactions">Transactions</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="links">Links <Badge size="sm" variant="secondary">{total ?? 0}</Badge> </TabsTrigger>
                                        <TabsTrigger className="pb-0" value="pending-payout">Pending Payout</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="paid-payout">Paid Payout</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="settings">Settings</TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>

                            <div className="py-6 max-w-5xl w-full mx-auto pt-0">
                                {/* overflow-x-auto: tables scroll inside their own box on mobile */}
                                <TabsContent value="customers" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>
                                <TabsContent value="commissions" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>
                                <TabsContent value="transactions" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>
                                <TabsContent value="links" className="overflow-x-auto">
                                    <PartnerLinksTable partnerId={partnerId} websiteUrl={program?.websiteUrl} currency={program?.currency ?? "USD"} urlParams={program?.urlParams} />
                                </TabsContent>
                                {/* placeholders so the two payout tabs don't render empty; swap in real tables later */}
                                <TabsContent value="pending-payout" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>
                                <TabsContent value="paid-payout" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>

                                <TabsContent value="settings" className="w-full space-y-4">
                                    {/* <div className="flex items-center flex-col py-4">
                                        <H3>Settings</H3>
                                        <Paragraph>Manage partner</Paragraph>
                                    </div> */}
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 max-w-xl">
                                        {partner && isAdminStatus(partner?.status) && <PartnerStatusCard className="w-full min-w-0" partner={partner} />}
                                        {partner && <PayoutMethodCard className="w-full min-w-0" partner={partner} />}
                                        {partner && program && <PartnerPayoutThresholdCard program={program} className="w-full min-w-0" partner={partner} />}
                                    </div>
                                </TabsContent>

                            </div>
                        </Tabs>
                    </PartnerDetailRightPanel>
                </PartnerDetail>
                {partner && <EditPayoutMethodModal open={editPayout} onOpenChange={setEditPayout} partner={partner} />}
                {partner && <EditPartnerStatusModal open={editPartnerStatus} onOpenChange={setEditPartnerStatus} partner={partner} />}
            </DashboardContent >
        </Dashboard >
    )
}


{/* <DetailsCard className="min-w-full">
    <DetailsCardHeader>
        <DetailsCardTitle className="flex items-center gap-1">
            Partner Details</DetailsCardTitle>
    </DetailsCardHeader>
    <DetailsCardContent>
        <DetailsRow title="Partner ID" value={<CopyableId value={partnerId} showCopyButton />} />
        <DetailsRow title="Partner since" value={<span className="text-xs">{formatDate(partner?.createdAt, "MMM_DD_YYYY_TIME")}</span>} />
        <DetailsRow
            title="Status"
            showEditIcon
            value={<PartnerStatusBadge variant="dot" status={partner?.status} />}
            onActionClick={() => setEditPartnerStatus(true)} />
        <DetailsRow title="Group" />
        <DetailsRow
            title="Payout method"
            value={<PayoutMethodValue partner={partner} />}
            showEditIcon
            onActionClick={() => setEditPayout(true)}
        />
        <DetailsRow title="Minimum payout" />
        <DetailsRow title="Partner website URL" />
    </DetailsCardContent>
</DetailsCard> */}
