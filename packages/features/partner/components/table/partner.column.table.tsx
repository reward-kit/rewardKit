"use client";

import { MoreHorizontal, Star } from "lucide-react";
import {
    SortableHeader,
    tableFeatures,
    rowSortingFeature,
    rowSelectionFeature,
    columnSizingFeature,
    type ColumnDef,
    createSortedRowModel,
} from "@rewardkit/packages/ui/components/table";
import { Checkbox } from "@rewardkit/packages/ui/components/checkbox";
import { Badge } from "@rewardkit/components/reui/badge";
import type { PartnerResource, PartnerStatus } from "@rewardkit/packages/types/partner/partner.schema";
import { PlainHeader } from "@rewardkit/packages/ui/components/data.table";
import { UserAvatar } from "@rewardkit/packages/ui/components/user-avatar";

export type PartnerRow = PartnerResource & {
    group?: { id: string; name: string; default: boolean } | null;
    stats?: {
        revenue: number;   // minor units (cents)
        earnings: number;  // minor units (cents)
        customers: number;
        clicks: number;
        leads: number;
    };
};

// single source of truth for the table's features
export const partnerTableFeatures = tableFeatures({
    rowSortingFeature,
    rowSelectionFeature,
    columnSizingFeature,
    sortedRowModel: createSortedRowModel(),
});

type PartnerColumnDef = ColumnDef<typeof partnerTableFeatures, PartnerRow>;

interface PartnerColumnsOptions {
    currency?: string;
    onRowAction?: (partner: PartnerRow) => void;
}

/* ------------------------------- helpers ------------------------------- */

const initials = (p: PartnerRow) =>
    `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase();

const money = (cents: number | undefined, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format((cents ?? 0) / 100);

const numeric = (n: number | undefined) => (n ?? 0).toLocaleString();

const cmp = (x: string | number, y: string | number) => (x < y ? -1 : x > y ? 1 : 0);
const cmpText = (x: string, y: string) => x.localeCompare(y, undefined, { numeric: true });

export const STATUS_STYLE: Record<PartnerStatus, { label: string; dot: string, className: string }> = {
    active: { label: "Active", dot: "bg-emerald-500", className: "" },
    pending: { label: "Pending", dot: "bg-amber-500", className: "" },
    invited: { label: "Invited", dot: "bg-sky-500", className: "" },
    suspended: { label: "Suspended", dot: "bg-orange-500", className: "" },
    rejected: { label: "Rejected", dot: "bg-red-500", className: "" },
};

/* -------------------------------- columns ------------------------------- */

export const partnerColumns = ({
    currency = "USD",
    onRowAction,
}: PartnerColumnsOptions = {}): PartnerColumnDef[] => [
        {
            id: "select",
            size: 40,
            enableSorting: false,
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v: boolean) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Select all"
                    className={"border-muted-foreground/20"}
                />
            ),
            cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v: boolean) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                        className={"border-muted-foreground/20"}
                    />
                </div>
            ),
        },
        {
            id: "partner",
            size: 240,
            header: ({ column }) => <SortableHeader column={column} title="Partner" />,
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            sortFn: (a, b) =>
                cmpText(
                    `${a.original.firstName} ${a.original.lastName}`,
                    `${b.original.firstName} ${b.original.lastName}`,
                ),
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <UserAvatar seed={p._id} firstName={p.firstName} />
                        <div className="flex min-w-0 flex-col leading-tight">
                            <span className="truncate text-xsm font-medium">
                                {p.firstName} {p.lastName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">{p.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "partnerId",
            size: 240,
            header: () => <PlainHeader title="Partner ID" />,
            enableSorting: false,
            cell: ({ row }) => (
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                    {row.original.id ?? row.original._id}
                </span>
            ),
        },

        {
            id: "status",
            size: 130,
            header: ({ column }) => <SortableHeader column={column} title="Status" />,
            accessorFn: (row) => row.status ?? "",
            sortFn: (a, b) => cmpText(a.original.status ?? "", b.original.status ?? ""),
            cell: ({ row }) => {
                if (!row.original?.status) return
                const s = STATUS_STYLE[row.original?.status];
                if (!s) return <span className="text-muted-foreground">—</span>;
                return (
                    <Badge variant="outline" className="gap-1.5">
                        <span className={`size-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                    </Badge>
                );
            },
        },
        {
            id: "tags",
            size: 130,
            header: () => <PlainHeader title="Tags" />,
            enableSorting: false,
            cell: ({ row }) => {
                const tags = row.original.tags ?? [];
                if (!tags.length) return <span className="text-muted-foreground">—</span>;
                return (
                    <div className="flex items-center gap-1">
                        {tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                {tag}
                            </Badge>
                        ))}
                        {tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "revenue",
            size: 150,
            header: ({ column }) => <SortableHeader column={column} title="Revenue" className="justify-end" />,
            accessorFn: (row) => row.stats?.revenue ?? 0,
            sortFn: (a, b) => cmp(a.original.stats?.revenue ?? 0, b.original.stats?.revenue ?? 0),
            cell: ({ row }) => (
                <div className="text-right font-medium text-xsm">{money(row.original.stats?.revenue, currency)}</div>
            ),
        },
        {
            id: "earnings",
            size: 150,
            header: ({ column }) => <SortableHeader column={column} title="Earnings" className="justify-end" />,
            accessorFn: (row) => row.stats?.earnings ?? 0,
            sortFn: (a, b) => cmp(a.original.stats?.earnings ?? 0, b.original.stats?.earnings ?? 0),
            cell: ({ row }) => (
                <div className="text-right font-medium text-xsm">{money(row.original.stats?.earnings, currency)}</div>
            ),
        },
        {
            id: "customers",
            size: 130,
            header: ({ column }) => <SortableHeader column={column} title="Customers" className="justify-end" />,
            accessorFn: (row) => row.stats?.customers ?? 0,
            sortFn: (a, b) => cmp(a.original.stats?.customers ?? 0, b.original.stats?.customers ?? 0),
            cell: ({ row }) => <div className="text-right text-xsm">{numeric(row.original.stats?.customers)}</div>,
        },
        {
            id: "clicks",
            size: 130,
            header: ({ column }) => <SortableHeader column={column} title="Clicks" className="justify-end" />,
            accessorFn: (row) => row.stats?.clicks ?? 0,
            sortFn: (a, b) => cmp(a.original.stats?.clicks ?? 0, b.original.stats?.clicks ?? 0),
            cell: ({ row }) => <div className="text-right text-xsm">{numeric(row.original.stats?.clicks)}</div>,
        },
        {
            id: "leads",
            size: 130,
            header: ({ column }) => <SortableHeader column={column} title="Leads" className="justify-end" />,
            accessorFn: (row) => row.stats?.leads ?? 0,
            sortFn: (a, b) => cmp(a.original.stats?.leads ?? 0, b.original.stats?.leads ?? 0),
            cell: ({ row }) => <div className="text-right text-xsm">{numeric(row.original.stats?.leads)}</div>,
        },
        {
            id: "group",
            size: 160,
            header: ({ column }) => <SortableHeader column={column} title="Group" />,
            accessorFn: (row) => row.group?.name ?? "",
            sortFn: (a, b) => cmpText(a.original.group?.name ?? "", b.original.group?.name ?? ""),
            cell: ({ row }) => {
                const group = row.original.group;
                if (!group) return <span className="text-muted-foreground">—</span>;
                return (
                    <div className="flex items-center gap-1.5">
                        {group.default && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                        <span className="text-xsm">{group.name}</span>
                    </div>
                );
            },
        },
        {
            id: "createdAt",
            size: 150,
            header: ({ column }) => <SortableHeader column={column} title="Signed up" />,
            accessorFn: (row) => row.createdAt ?? "",
            // ISO strings sort correctly as plain strings
            sortFn: (a, b) => cmp(a.original.createdAt ?? "", b.original.createdAt ?? ""),
            cell: ({ row }) => {
                const date = row.original.createdAt;
                if (!date) return <span className="text-muted-foreground">—</span>;
                return (
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs">{new Date(date).toLocaleDateString()}</span>
                        <span className="text-[0.65rem] text-muted-foreground">
                            {new Date(date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                );
            },
        },
    ];