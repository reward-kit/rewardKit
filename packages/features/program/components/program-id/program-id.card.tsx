import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rewardkit/packages/ui/components/card"
import { CopyableId } from "@rewardkit/packages/ui/components/copyable-id"
import type { ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { cn } from "@rewardkit/lib/utils"

interface ProgramIdCardProps {
    program: ProgramResource
    className?: string
    isLoading?: boolean
}

/** Read-only: identifies the program in the widget and API. */
export const ProgramIdCard = ({ program, className, isLoading }: ProgramIdCardProps) => (
    <Card className={cn("flex h-full w-full flex-col gap-0 overflow-hidden rounded-2xl bg-popover py-0", className)}>
        <CardHeader className="gap-1 px-5 pt-5">
            <CardTitle className="text-sm! font-medium">Program ID</CardTitle>
            <CardDescription className="text-xs!">Identifies your program in the widget and API.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 px-5 py-4">
            <CopyableId showCopyButton isLoading={isLoading} value={program.id ?? program._id ?? "-"} />
        </CardContent>
    </Card>
)
