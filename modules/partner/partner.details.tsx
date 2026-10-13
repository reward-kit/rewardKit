"use client"

import { getCountry } from "@rewardkit/lib/countries"
import { PartnerActiveListTable } from "@rewardkit/packages/features/partner/components/table/partner.active.table"
import { useActivePartnerId } from "@rewardkit/packages/features/partner/hooks/useActivePartnerId"
import { usePartner } from "@rewardkit/packages/features/partner/hooks/usePartner"
import { partnersHref } from "@rewardkit/packages/features/partner/lib/partner.search-params"
import { Button } from "@rewardkit/packages/ui/components/button"
import { Dashboard, DashboardContent, DashboardHeader } from "@rewardkit/packages/ui/components/layout/dashboard.layout"
import { Settings, SettingsHeader, SettingsTitle } from "@rewardkit/packages/ui/components/layout/settings.layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rewardkit/packages/ui/components/tabs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"
import { Badge } from "@rewardkit/components/reui/badge"
import { PartnerEditDialog } from "./partner.edit.dialog"
import { AppTooltip } from "@rewardkit/packages/ui/components/tooltip/tooltip"
import { DetailsCard, DetailsCardContent, DetailsCardHeader, DetailsCardTitle, DetailsRow } from "@rewardkit/components/details-card"
import { PARTNER_STATUS_STYLE } from "@rewardkit/packages/features/partner/contants/status"
import { AppDialog } from "@rewardkit/packages/ui/components/dialog/app-dialog"
import { PayoutMethodForm } from "@rewardkit/packages/features/partner/components/payout-method/payout-method.form"
import React from "react"
import { PartnerDetail, PartnerDetailLeftPanel, PartnerDetailMetricsCard, PartnerDetailProfileCard, PartnerDetailRightPanel } from "@rewardkit/packages/features/partner/components/layout/partner.detail.layout"
import { CopyableId } from "@rewardkit/packages/ui/components/copyable-id"
import { formatDate } from "@rewardkit/lib/date/formateDate"
import { EditPayoutMethodModal } from "@rewardkit/packages/features/partner/components/payout-method/payout-method.modal"
import { Small } from "@rewardkit/packages/ui/components/typography"
import { PayoutMethodValue } from "@rewardkit/packages/features/partner/components/payout-method/payout-method.value"
import { PartnerStatusBadge } from "@rewardkit/packages/ui/components/status/partner.status"
import { EditPartnerStatusModal } from "@rewardkit/packages/features/partner/components/partner-status/partner-status.model"
import { TextInput } from "@rewardkit/packages/ui/components/input/text.input"
import { PartnerStatusForm } from "@rewardkit/packages/features/partner/components/partner-status/partner-status.form"

export const PartnerDetails = () => {
    const activeId = useActivePartnerId()
    const partnerId = activeId ?? ""
    const { partner, isLoading, handleDelete, remove } = usePartner(partnerId)
    const [editPayout, setEditPayout] = React.useState(false)
    const [editPartnerStatus, setEditPartnerStatus] = React.useState(false)

    const qs = useSearchParams().toString()
    const backHref = qs ? `/w/partners?${qs}` : partnersHref()
    const router = useRouter()


    const handlePartnerDelete = async () => {
        await handleDelete({ partnerId })
        router.push(backHref)
    }

    const country = partner && getCountry(partner?.countryCode)

    const overviewMetrics = [
        { label: "Revenue", value: "$1400" },
        { label: "Earnings", value: "$540" },
        { label: "Customers", value: "10" },
        { label: "Conversion", value: "60%" },
        { label: "Clicks", value: "1200" },
    ]

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
                                <div className="max-w-7xl mx-auto overflow-x-auto px-4">
                                    <TabsList variant="line" className="pb-0 gap-8 justify-start">
                                        <TabsTrigger className="pb-0" value="customers">Customers</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="commissions">Commissions</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="transactions">Transactions</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="links">Links</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="pending-payout">Pending Payout</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="paid-payout">Paid Payout</TabsTrigger>
                                        <TabsTrigger className="pb-0" value="settings">Settings</TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>

                            <div className="py-6 px-4 max-w-7xl w-full mx-auto pt-0">
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
                                    <PartnerActiveListTable />
                                </TabsContent>
                                {/* placeholders so the two payout tabs don't render empty; swap in real tables later */}
                                <TabsContent value="pending-payout" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>
                                <TabsContent value="paid-payout" className="overflow-x-auto">
                                    <PartnerActiveListTable />
                                </TabsContent>

                                <TabsContent value="settings" className="space-y-8">

                                    <div className="grid grid-cols-3 gap-8">
                                        <PayoutMethodForm id={partnerId} partner={partner} onSubmit={() => { }} />
                                        <PartnerStatusForm id={partnerId} partner={partner} onSubmit={() => { }} />
                                    </div>

                                    <Button variant="destructive" className="w-fit" size="sm" isLoading={remove.isPending} onClick={() => handlePartnerDelete()}>
                                        Delete partner
                                    </Button>
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
