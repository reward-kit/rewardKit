import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema"

const ADMIN_STATUSES = [PARTNER_STATUS.ACTIVE, PARTNER_STATUS.SUSPENDED, PARTNER_STATUS.REJECTED] as const

export const isAdminStatus = (s?: string | null): s is (typeof ADMIN_STATUSES)[number] => !!s && (ADMIN_STATUSES as readonly string[]).includes(s)