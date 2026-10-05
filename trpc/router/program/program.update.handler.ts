import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { UpdateProgramRequest } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type UpdateProgram = {
    ctx: ContextProps
    input: UpdateProgramRequest
}

export async function updateProgram({ ctx, input }: UpdateProgram) {
    await assertOrgMember({ ctx })
    const program = await programService.updateProgram({ programId: input.programId, programData: input.programData })
    return { ...program }
}