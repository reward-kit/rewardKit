import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { Label } from '@rewardkit/packages/ui/components/label'
import { Switch } from '@rewardkit/packages/ui/components/switch'

export const SelfReferDialog = () => {
    const { program, isLoading, update, handleUpdate } = useProgram()
    const checked = !!program?.blockSelfReferrals

    return (
        <div className="flex items-center justify-end gap-2">
            <Label htmlFor="block-self-refer" className="cursor-pointer">{checked ? "Yes" : "No"}</Label>
            <Switch
                id="block-self-refer"
                disabled={isLoading || update.isPending}
                checked={checked}
                onCheckedChange={(next) =>
                    program?.id &&
                    handleUpdate({ programId: program.id, program: { blockSelfReferrals: next } })
                }
            />
        </div>
    )
}