import { TRPCError } from "@trpc/server"
import { programService } from "@rewardkit/packages/features/program/services/program.service"
import { GetProgramResponse } from "@rewardkit/packages/types/program/program.api.schema"
import { ContextProps } from "@rewardkit/trpc/_trpc"
import { assertOrgMember } from "@rewardkit/trpc/lib/assertOrgMember"
import { defineCookie } from "@rewardkit/packages/server/lib/cookie"
import { NotFoundError } from "@rewardkit/packages/errors/app-error"

export const activeProgramCookie = defineCookie("rewardkit_active_program_id", {
    maxAge: 60 * 60 * 24 * 365, // 1 year
})

export type GetCurrentProgram = {
    ctx: ContextProps
}

export async function getCurrentProgram({ ctx }: GetCurrentProgram): Promise<GetProgramResponse> {
    const { orgId } = await assertOrgMember({ ctx })
    const { programs } = await programService.listPrograms({ orgId })

    if (!programs.length) {
        throw new NotFoundError("Product not found")
    }

    const activeId = await activeProgramCookie.get()
    const idOf = (p: (typeof programs)[number]) => String(p._id ?? p.id)

    // cookie must match a program in THIS org, so a stale or forged id is ignored
    const program = programs.find((p) => idOf(p) === activeId) ?? programs[0]

    if (idOf(program) !== activeId) {
        await activeProgramCookie.set(idOf(program))
    }

    return { success: true, message: "Program retrieved successfully", program }
}