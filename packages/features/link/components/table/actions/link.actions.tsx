// link.actions.tsx
"use client"

import { MoreHorizontal, Power, Trash2 } from "lucide-react"
import { LINK_STATUS } from "@rewardkit/packages/types/link/link.schema"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@rewardkit/packages/ui/components/dropdown-menu"
import { usePartnerLinks } from "../../../hooks/usePartnerLinks"
import type { LinkRow } from "../link.column.table"

type Props = {
    link: LinkRow
    "aria-label"?: string
}

const linkIdOf = (link: LinkRow) => link.id ?? link._id ?? ""

export const LinkActions = ({ link, ...props }: Props) => {
    const { handleUpdate, handleDelete, isUpdating, isDeleting } = usePartnerLinks({ partnerId: link.partnerId })
    const isActive = link.status === LINK_STATUS.ACTIVE

    return (
        <DropdownMenu>
            <DropdownMenuTrigger aria-label="Link actions" {...props}>
                <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        disabled={isUpdating}
                        onClick={() =>
                            handleUpdate({
                                partnerId: link.partnerId,
                                linkId: linkIdOf(link),
                                linkData: { status: isActive ? LINK_STATUS.DISABLED : LINK_STATUS.ACTIVE },
                            })
                        }
                    >
                        <Power />
                        {isActive ? "Disable link" : "Enable link"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => handleDelete({ partnerId: link.partnerId, linkId: linkIdOf(link) })}
                    >
                        <Trash2 />
                        Delete link
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
