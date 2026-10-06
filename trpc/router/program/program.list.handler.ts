import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertUser } from "@rewardkit/trpc/lib/assertUser"

export type ProgramList = {
    ctx: ContextProps,
}

export async function programList({ ctx }: ProgramList) {
    const { userId } = await assertUser({ ctx })

    const programs = await programService.listPrograms({ userId })

    return { ...programs }
}