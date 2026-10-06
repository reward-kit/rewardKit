import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { GetProgramResponse } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { NotFoundError } from "@rewardkit/packages/errors/app-error"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type GetCurrentProgram = {
    ctx: ContextProps
}

export async function getCurrentProgram({ ctx }: GetCurrentProgram): Promise<GetProgramResponse> {
    const { orgId } = await assertOrgMember({ ctx })
    const program = await programService.getProgramByOrgId({ orgId })

    if (!program) {
        throw new NotFoundError("Product not found")
    }

    return program
}