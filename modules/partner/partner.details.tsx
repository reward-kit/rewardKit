"use client"

import { getCountry } from "@rewardkit/lib/countries"
import { PartnerActiveListTable } from "@rewardkit/packages/features/partner/components/table/partner.active.table"
import { useActivePartnerId } from "@rewardkit/packages/features/partner/hooks/useActivePartnerId"
import { usePartner } from "@rewardkit/packages/features/partner/hooks/usePartner"
import { partnersHref } from "@rewardkit/packages/features/partner/lib/partner.search-params"
import { Button } from "@rewardkit/packages/ui/components/button"
import { MetricBarChart } from "@rewardkit/packages/ui/components/charts/metric-bar-chart.component"
import { Image } from "@rewardkit/packages/ui/components/image"
import { Dashboard, DashboardContent } from "@rewardkit/packages/ui/components/layout/dashboard.layout"
import { Settings, SettingsContent, SettingsHeader, SettingsRow, SettingsTitle } from "@rewardkit/packages/ui/components/layout/settings.layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rewardkit/packages/ui/components/tabs"
import { H3, Paragraph, Small } from "@rewardkit/packages/ui/components/typography"
import { UserAvatar } from "@rewardkit/packages/ui/components/user-avatar"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"
import { Badge } from "@rewardkit/components/reui/badge"
import { STATUS_STYLE } from "@rewardkit/packages/features/partner/components/table/partner.column.table"
import { cn } from "cn"
import { Card, CardContent, CardHeader, CardTitle } from "@rewardkit/packages/ui/components/card"
import { PartnerEditDialog } from "./partner.edit.dialog"

type PartnerMonth = { month: string; revenue: number; earnings: number }

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

// earnings are ~20% commission on revenue
const chartData: PartnerMonth[] = [
    { month: "Jan", revenue: 300, earnings: 60 },
    { month: "Feb", revenue: 550, earnings: 110 },
    { month: "Mar", revenue: 400, earnings: 80 },
    { month: "Apr", revenue: 630, earnings: 126 },
    { month: "May", revenue: 460, earnings: 92 },
    { month: "Jun", revenue: 780, earnings: 156 },
    { month: "Jul", revenue: 390, earnings: 78 },
    { month: "Aug", revenue: 925, earnings: 185 },
    { month: "Sep", revenue: 645, earnings: 129 },
    { month: "Oct", revenue: 530, earnings: 106 },
    { month: "Nov", revenue: 700, earnings: 140 },
    { month: "Dec", revenue: 270, earnings: 54 },
]

/* One reusable card so Overview and Earnings tabs always look identical */
const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
    <Card className="w-full min-w-0 gap-2 py-5">
        <CardHeader>
            <CardTitle className="text-xs font-normal">{label}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <H3 className="truncate">{value}</H3>
        </CardContent>
    </Card>
)

/* 2 columns on mobile / tablet, 4 columns once the right pane is wide enough (xl) */
const METRIC_GRID = "grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"

export const PartnerDetails = ({ partnerId: initialId }: { partnerId: string }) => {
    const activeId = useActivePartnerId()
    const partnerId = activeId ?? initialId
    const { partner, handleDelete, handleUpdate, isUpdating, remove } = usePartner(partnerId)
    const p = partner
    const router = useRouter()

    const qs = useSearchParams().toString()
    const backHref = qs ? `/w/partners?${qs}` : partnersHref()

    if (!p) {
        return <p className="p-4 text-sm text-muted-foreground">Partner not found.</p>
    }

    const handlePartnerDelete = async () => {
        await handleDelete({ partnerId })
        router.push(backHref)
    }

    const country = getCountry(partner?.countryCode)

    const s = STATUS_STYLE[partner.status ?? PARTNER_STATUS.PENDING]

    const overviewMetrics = [
        { label: "Earnings", value: "$0" },
        { label: "Revenue", value: "$0" },
        { label: "Customers", value: "$0" },
        { label: "Conversion", value: "$0" },
    ]

    const commissionMetrics = [
        { label: "Rejected", value: "$0" },
        { label: "Pending", value: "$0" },
        { label: "Approved", value: "$0" },
        { label: "Paid", value: "$0" },
    ]

    return (
        <Dashboard>
            <DashboardContent className="py-0">
                {/*
                    Responsive layout:
                    - below lg: header card stacks (profile on top, stats underneath)
                    - lg and up: profile on the left, stats on the right
                    - metric cards: 2 columns until xl, then 4
                */}
                <div className="flex w-full flex-col items-start gap-6">
                    {/* ───────── Header card ───────── */}
                    <div className="w-full min-w-0 px-2 pt-4">
                        <div className="pb-4">
                            <Button variant="outline" size="sm" nativeButton={false} render={(props) => <Link {...props} href={backHref} />} className="min-w-fit rounded-md">
                                <ChevronLeft className="size-4" />
                                Partners
                            </Button>
                        </div>

                        <div className="flex w-full flex-col overflow-hidden rounded-lg border lg:flex-row lg:items-stretch">
                            {/* Profile — min-w-0 lets long emails truncate instead of overflowing */}
                            <div className="flex w-full min-w-0 gap-4 border-b p-4 sm:gap-6 sm:p-6 lg:max-w-sm lg:shrink-0 lg:border-b-0">
                                <div className="flex shrink-0 flex-col items-center gap-2">
                                    <UserAvatar seed={partner.email} firstName={partner.firstName} size="xl" />
                                    <Badge variant="outline" className={cn("gap-1.5", s.className)}>
                                        <span className={`size-1.5 rounded-full ${s.dot}`} />
                                        {s.label}
                                    </Badge>
                                </div>
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="min-w-0">
                                        <H3 className="truncate text-lg/snug">{partner.firstName} {partner?.lastName}</H3>
                                        <Paragraph className="truncate text-sm/snug text-muted-foreground">{partner.email}</Paragraph>
                                    </div>
                                    {partner?.companyName && <div className="flex min-w-0 items-center gap-1">
                                        <Small className="shrink-0 text-xs">Company:</Small>
                                        <Small className="truncate text-xs">{partner.companyName}</Small>
                                    </div>}
                                    <div className="flex items-center gap-2">
                                        <Image alt={country.name} className="w-4.5" src={country?.flagUrl} />
                                        <Small className="text-xs">{country.name}</Small>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PartnerEditDialog partnerData={partner} />
                                    </div>
                                </div>
                            </div>

                            {/* Stats — below the profile on mobile, to the right from lg up */}
                            <div className="min-w-0 flex-1 lg:border-l">
                                <Tabs className="w-full">
                                    <div className="overflow-x-auto border-b px-4 sm:px-6">
                                        <TabsList variant="line">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="earnings">Earnings</TabsTrigger>
                                        </TabsList>
                                    </div>
                                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <TabsContent value="overview" className={METRIC_GRID}>
                                            {overviewMetrics.map((m) => (
                                                <MetricCard key={m.label} label={m.label} value={m.value} />
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="earnings" className={METRIC_GRID}>
                                            {commissionMetrics.map((m) => (
                                                <MetricCard key={m.label} label={m.label} value={m.value} />
                                            ))}
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* ───────── Tabs column — min-w-0 stops wide tables from pushing the page sideways ───────── */}
                    <div className="w-full min-w-0 px-2 pb-6">
                        <Tabs className="w-full gap-6 sm:gap-8">
                            {/* tab bar scrolls sideways on narrow screens instead of truncating */}
                            <div className="max-w-full overflow-x-auto pb-0 bg-accent rounded-xl">
                                <TabsList className="w-max pb-0 gap-6 justify-start">
                                    <TabsTrigger className="pb-0" value="performance">Performance</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="customers">Customers</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="commissions">Commissions</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="transactions">Transactions</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="links">Links</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="pending-payout">Pending Payout</TabsTrigger>
                                    <TabsTrigger className="pb-0" value="paid-payout">Paid Payout</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="performance" className={"grid grid-cols-2 gap-6"}>
                                <MetricBarChart<PartnerMonth>
                                    title="Partner revenue & earnings"
                                    description="January 2026 - December 2026"
                                    data={chartData}
                                    xKey="month"
                                    series={[
                                        { key: "revenue", label: "Revenue", color: "var(--color-green-300)", valueFormatter: usd.format },
                                        { key: "earnings", label: "Earnings", color: "var(--color-blue-300)", valueFormatter: usd.format },
                                    ]}
                                    tooltipLabelFormatter={(m) => `${m} 2026`}
                                    showValueLabels={false} // 12 bars is too dense for labels on top
                                />
                                <MetricBarChart<PartnerMonth>
                                    title="Partner customers"
                                    description="January 2026 - December 2026"
                                    data={chartData}
                                    xKey="month"
                                    series={[
                                        { key: "revenue", label: "Revenue", color: "var(--color-green-300)", valueFormatter: usd.format },
                                    ]}
                                    tooltipLabelFormatter={(m) => `${m} 2026`}
                                    showValueLabels={false} // 12 bars is too dense for labels on top
                                />
                            </TabsContent>

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
                                {/* items-start + gap (no space-y) keeps cards on the same top line; wraps to one column on small screens */}
                                <div className="flex flex-wrap items-start gap-8">
                                    <Settings className="w-full max-w-xl">
                                        <SettingsHeader>
                                            <SettingsTitle>Payout</SettingsTitle>
                                        </SettingsHeader>
                                    </Settings>
                                </div>

                                <Button variant="destructive" className="w-fit" size="sm" isLoading={remove.isPending} onClick={() => handlePartnerDelete()}>
                                    Delete partner
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DashboardContent>
        </Dashboard>
    )
}