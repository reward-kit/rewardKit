import { useProgram } from '@rewardkit/packages/features/program/hooks/useProgram'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@rewardkit/packages/ui/components/alert-dialog'
import { Button } from '@rewardkit/packages/ui/components/button';

export const ProgramStatusDialog = () => {
    const { program, handleUpdate, isUpdating } = useProgram();

    if (program?.status == "inactive") {
        return (<div className="flex justify-end w-full">
            <Button isLoading={isUpdating} variant="secondary" size="xs" onClick={() => program?.id && handleUpdate({ programId: program.id, program: { status: "active" } })}>{"Resume"}</Button>
        </div>)
    }
    return (
        <div className="flex justify-end w-full">
            <AlertDialog>
                <AlertDialogTrigger render={(props) => <Button {...props} variant="secondary" size="xs" />}>
                    Pause
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>⚠️ Please confirm</AlertDialogTitle>
                        <AlertDialogDescription>Pausing the affiliate program will block partners from using the portal.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating} size={"sm"}>Cancel</AlertDialogCancel>
                        <AlertDialogAction isLoading={isUpdating} variant={"destructive"} size="sm" onClick={() => program?.id && handleUpdate({ programId: program.id, program: { status: "inactive" } })} >Pause</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
