import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"

export type ProgramList = {
    ctx: ContextProps,
}

export async function programList({ ctx }: ProgramList) {
    const { orgId } = await assertOrgMember({ ctx })

    const programs = await programService.listPrograms({ orgId })

    return { ...programs }
}