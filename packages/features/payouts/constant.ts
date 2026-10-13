import { PAYOUT_METHOD, PayoutMethod } from "@rewardkit/packages/types/payout/payout.schema";

export const PAYOUT_METHOD_OPTIONS = [
    { label: 'PayPal', value: PAYOUT_METHOD.PAYPAL, imageUrl: '/svg/paypal.svg' },
    { label: 'Wise', value: PAYOUT_METHOD.WISE, imageUrl: '/svg/wise.svg' },
]