import { PartnerGroupDetailsPage } from "@rewardkit/modules/program/partner-group/partner.group.details.page"

export default async function Page({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params
    return <PartnerGroupDetailsPage groupId={groupId} />
}