import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { CheckSubdomainRequest, CheckSubdomainResponse } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertUser } from "@rewardkit/trpc/lib/assertUser"

export type CheckSubdomain = {
    ctx: ContextProps
    input: CheckSubdomainRequest
}

export async function checkSubdomain({ ctx, input }: CheckSubdomain): Promise<CheckSubdomainResponse> {
    await assertUser({ ctx })
    return programService.checkSubdomainAvailability(input)
}