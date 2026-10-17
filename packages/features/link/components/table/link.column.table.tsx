"use client";

import {
    SortableHeader,
    tableFeatures,
    rowSortingFeature,
    rowSelectionFeature,
    columnSizingFeature,
    type ColumnDef,
    createSortedRowModel,
} from "@rewardkit/packages/ui/components/table";
import type { LinkListItem } from "@rewardkit/packages/types/link/link.api.schema";
import { formatDate } from "@rewardkit/lib/date/formateDate";
import { formatMoney } from "@rewardkit/lib/amount/money";
import { AppCopyTooltip } from "@rewardkit/packages/ui/components/tooltip/tooltip";
import { LinkActions } from "./actions/link.actions";

export type LinkRow = LinkListItem;

// single source of truth for the table's features
export const linkTableFeatures = tableFeatures({
    rowSortingFeature,
    rowSelectionFeature,
    columnSizingFeature,
    sortedRowModel: createSortedRowModel(),
});

type LinkColumnDef = ColumnDef<typeof linkTableFeatures, LinkRow>;

interface LinkColumnsOptions {
    currency?: string;
}

/* ------------------------------- helpers ------------------------------- */

const money = (cents: number | undefined, currency: string) => formatMoney(cents ?? 0, currency);

const numeric = (n: number | undefined) => (n ?? 0).toLocaleString();

const cmp = (x: string | number, y: string | number) => (x < y ? -1 : x > y ? 1 : 0);
const cmpText = (x: string, y: string) => x.localeCompare(y, undefined, { numeric: true });

/* -------------------------------- columns ------------------------------- */

export const linkColumns = ({ currency = "USD" }: LinkColumnsOptions = {}): LinkColumnDef[] => [
    {
        id: "link",
        size: 240,
        header: ({ column }) => <SortableHeader column={column} title="Link" />,
        accessorFn: (row) => row.code ?? "",
        sortFn: (a, b) => cmpText(a.original.code ?? "", b.original.code ?? ""),
        cell: ({ row }) => {
            const link = row.original;
            const url = link.url ?? link.code;
            return (
                <div className="flex max-w-60 w-full min-w-0 items-center gap-2">
                    <AppCopyTooltip side="bottom" copyValue={url} content={url}>
                        <div className="flex min-w-0 flex-col gap-1 leading-tight">
                            <span className="truncate text-xsm text-foreground">{url}</span>
                        </div>
                    </AppCopyTooltip>
                </div>
            );
        },
    },
    {
        id: "clicks",
        size: 110,
        header: ({ column }) => <SortableHeader column={column} title="Clicks" className="justify-end" />,
        accessorFn: (row) => row.stats?.clicks ?? 0,
        sortFn: (a, b) => cmp(a.original.stats?.clicks ?? 0, b.original.stats?.clicks ?? 0),
        cell: ({ row }) => <div className="text-right text-xsm">{numeric(row.original.stats?.clicks)}</div>,
    },
    {
        id: "leads",
        size: 110,
        header: ({ column }) => <SortableHeader column={column} title="Leads" className="justify-end" />,
        accessorFn: (row) => row.stats?.leads ?? 0,
        sortFn: (a, b) => cmp(a.original.stats?.leads ?? 0, b.original.stats?.leads ?? 0),
        cell: ({ row }) => <div className="text-right text-xsm">{numeric(row.original.stats?.leads)}</div>,
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
        id: "revenue",
        size: 140,
        header: ({ column }) => <SortableHeader column={column} title="Revenue" className="justify-end" />,
        accessorFn: (row) => row.stats?.revenue ?? 0,
        sortFn: (a, b) => cmp(a.original.stats?.revenue ?? 0, b.original.stats?.revenue ?? 0),
        cell: ({ row }) => (
            <div className="text-right max-w-20 w-full font-medium text-xsm">
                {money(row.original.stats?.revenue, currency)}
            </div>
        ),
    },
    {
        id: "commission",
        size: 150,
        header: ({ column }) => <SortableHeader column={column} title="Commission" className="justify-end" />,
        accessorFn: (row) => row.stats?.commission ?? 0,
        sortFn: (a, b) => cmp(a.original.stats?.commission ?? 0, b.original.stats?.commission ?? 0),
        cell: ({ row }) => (
            <div className="text-right max-w-20 w-full font-medium text-xsm">
                {money(row.original.stats?.commission, currency)}
            </div>
        ),
    },
    {
        id: "createdAt",
        size: 120,
        header: ({ column }) => <SortableHeader column={column} title="Created at" />,
        accessorFn: (row) => row.createdAt ?? "",
        // ISO strings sort correctly as plain strings
        sortFn: (a, b) => cmp(a.original.createdAt ?? "", b.original.createdAt ?? ""),
        cell: ({ row }) => {
            const date = row.original.createdAt;
            if (!date) return <span className="text-muted-foreground">—</span>;
            return (
                <div className="flex flex-col leading-tight">
                    <span className="text-xs">{formatDate(date, "MMM_DD_YYYY")}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        size: 48,
        cell: ({ row }) => (
            <div className="flex justify-start mr-2 h-9" onClick={(e) => e.stopPropagation()}>
                <LinkActions link={row.original} aria-label="Link actions" />
            </div>
        ),
    },
];
