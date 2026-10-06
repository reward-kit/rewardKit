import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { DeleteProgramInput } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertUser } from "@rewardkit/trpc/lib/assertUser"

export type DeleteProgram = {
    ctx: ContextProps
    input: DeleteProgramInput
}

export async function deleteProgram({ ctx, input }: DeleteProgram) {
    const { userId } = await assertUser({ ctx })
    return programService.deleteProgram({ programId: input.programId, userId })
}