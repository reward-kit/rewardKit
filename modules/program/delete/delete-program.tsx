"use client"

import { useOrganizationList, useSession } from "@clerk/nextjs"
import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@rewardkit/packages/ui/components/alert-dialog"
import { Button } from "@rewardkit/packages/ui/components/button"
import { CopyableId } from "@rewardkit/packages/ui/components/copyable-id"
import { Input } from "@rewardkit/packages/ui/components/input"
import { TextInput } from "@rewardkit/packages/ui/components/input/text.input"
import { Label } from "@rewardkit/packages/ui/components/label"
import { trpc } from "@rewardkit/trpc/react/client"
import { useRouter } from "next/navigation"

export const DeleteProgramDialog = () => {
    const router = useRouter()
    const utils = trpc.useUtils()
    const { program, programs, handleDelete, remove } = useProgram()
    const { setActive } = useOrganizationList()
    const { session } = useSession()

    const CONFIRM_TEXT = program?.name ?? "permanently delete"

    const matchesConfirm = (value: string) => value.trim().toLowerCase() === CONFIRM_TEXT.trim().toLowerCase()

    if (!program) return null

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const typed = String(new FormData(e.currentTarget).get("confirmName") ?? "").trim()
        if (!matchesConfirm(typed) || !program.id) return // setCustomValidity already blocks this

        const ok = await handleDelete(program.id)
        if (!ok) return // the hook already showed the error toast

        // the active org no longer exists: move to another program, or back to onboarding
        const next = programs.data?.programs.find((p) => p.id !== program.id)
        if (next?.orgId) await setActive?.({ organization: next.orgId })
        await session?.reload() // pulls the updated onboarding flag into the token
        await utils.invalidate()
        router.push(next ? "/w" : "/onboarding/program")
    }

    return (
        <div className="flex justify-end w-full">
            <AlertDialog>
                <AlertDialogTrigger render={(props) => <Button {...props} variant="destructive" size="xs" />}>
                    Delete program
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this program?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This permanently deletes the program, its portal subdomain and all uploaded files.
                                This can't be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="space-y-3">
                            <Label
                                htmlFor="confirmName"
                                className="flex flex-wrap items-center gap-1 leading-snug"
                            >
                                <span>Type</span>
                                <CopyableId value={CONFIRM_TEXT} />
                                <span>to confirm</span>
                            </Label>
                            <TextInput
                                id="confirmName"
                                name="confirmName"
                                autoComplete="off"
                                required
                                placeholder={CONFIRM_TEXT}
                                onChange={(val, e) =>
                                    e?.currentTarget.setCustomValidity(
                                        matchesConfirm(val) ? "" : `Type "${CONFIRM_TEXT}" to confirm`
                                    )
                                } />
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={remove.isPending} size="sm">
                                Cancel
                            </AlertDialogCancel>
                            {/* a plain submit button, not AlertDialogAction, which would close the dialog before the delete finishes */}
                            <Button type="submit" variant="destructive" size="sm" isLoading={remove.isPending}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}