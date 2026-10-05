import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { Label } from '@rewardkit/packages/ui/components/label'
import { Switch } from '@rewardkit/packages/ui/components/switch'

export const BlockPersonalMailUseDialog = () => {
    const { program, isLoading, update, handleUpdate } = useProgram()
    const checked = !!program?.restrictPersonalEmail

    return (
        <div className="flex items-center justify-end gap-2">
            <Label htmlFor="block-personal-email" className="cursor-pointer">{checked ? "Yes" : "No"}</Label>
            <Switch
                id="block-personal-email"
                disabled={isLoading || update.isPending}
                checked={checked}
                onCheckedChange={(next) =>
                    program?.id &&
                    handleUpdate({ programId: program.id, program: { restrictPersonalEmail: next } })
                }
            />
        </div>
    )
}