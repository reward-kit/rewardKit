import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { CreateProgramInput } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertUser } from "@rewardkit/trpc/lib/assertUser"

export type CreateProgram = {
    ctx: ContextProps
    input: CreateProgramInput
}

export async function createProgram({ ctx, input }: CreateProgram) {
    const { userId } = await assertUser({ ctx })
    const program = await programService.createProgram({ userId, programData: input.programData })
    return { ...program }
}