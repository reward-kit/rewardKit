// packages/ui/components/data-table.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
} from "lucide-react";
import {
    flexRender,
    type Row,
    type RowData,
    type Table as ReactTableType,
    type TableFeatures,
} from "@tanstack/react-table";

import { cn } from "@rewardkit/lib/utils";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";

/* -------------------------------------------------------------------------- */
/*  Variants. To add a design, add one key to each cva below (and a footer).  */
/* -------------------------------------------------------------------------- */

const rootVariants = cva("w-full overflow-hidden", {
    variants: {
        variant: {
            grid: "border-t border-border",                // Tolt partners: full-bleed, cell borders
            card: "rounded-xl border border-border",       // Tolt settings: rounded card
            plain: "",                                     // no chrome
        },
    },
    defaultVariants: { variant: "card" },
});

// NEW: applied to the <table> itself. `border-separate` is required for row gaps.
const tableVariants = cva("", {
    variants: {
        variant: {
            grid: "",
            card: "",
            plain: "border-separate border-spacing-y-1", // gap between rows
        },
    },
    defaultVariants: { variant: "card" },
});

const headVariants = cva(
    "whitespace-nowrap text-left align-middle text-muted-foreground! [--header-text-color:text-muted-foreground]",
    {
        variants: {
            variant: {
                grid: "border-b border-border last:border-r-0",
                card: "border-b border-border",
                plain: "",
            },
            size: {
                sm: "h-8.75 px-3 text-xxs! [--header-text-size:sm]",
                md: "h-9.5 px-3 text-xsm [--header-text-size:sm]",
                lg: "h-12 px-4 text-xsm [--header-text-size:xsm]",
            },
        },
        defaultVariants: { variant: "card", size: "md" },
    },
);

// text style for plain (non-sortable) header content; keep in sync with SortableHeader
const headerTextVariants = cva("font-normal text-muted-foreground/50!", {
    variants: {
        size: {
            sm: "text-xxs!",
            md: "text-xsm!",
            lg: "text-xsm",
        },
    },
    defaultVariants: { size: "md" },
});

// CHANGED: plain rows are transparent; the background/border/radius live on the cells.
// (In border-separate mode, <tr> can't be rounded or bordered.)
const rowVariants = cva("transition-colors", {
    variants: {
        variant: {
            grid: "border-b border-border last:border-b-0",
            card: "border-b border-border last:border-b-0",
            plain: "bg-transparent hover:bg-transparent",
        },
        clickable: {
            true: "cursor-pointer",
            false: "",
        },
    },
    compoundVariants: [
        { clickable: true, variant: ["grid", "card"], class: "hover:bg-accent/40" },
        { clickable: true, variant: "plain", class: "[&:hover>td]:bg-accent/60" },
    ],
    defaultVariants: { variant: "card", clickable: false },
});

// CHANGED: plain cells get the card background, a border, and rounded outer corners
const cellVariants = cva("align-middle", {
    variants: {
        variant: {
            grid: "border-border last:border-r-0",
            card: "",
            plain:
                "bg-card transition-colors " +
                "first:rounded-l-xl " +
                "last:rounded-r-xl",
        },
        size: {
            sm: "px-3 py-2.5 text-xs",
            md: "px-3 py-2.5 text-sm",
            lg: "px-4 py-3.5 text-sm",
        },
    },
    defaultVariants: { variant: "card", size: "md" },
});

const footerVariants = cva("flex items-center text-muted-foreground/70", {
    variants: {
        variant: {
            grid: "border-t border-border px-3 py-1",
            card: "border-t border-border px-3 py-2",
            plain: "px-1 py-2",
        },
        size: {
            sm: "text-xs",
            md: "text-xs",
            lg: "text-sm",
        },
    },
    defaultVariants: { variant: "card", size: "md" },
});

type StyleProps = VariantProps<typeof headVariants>;
export type DataTableVariant = NonNullable<StyleProps["variant"]>;
export type DataTableSize = NonNullable<StyleProps["size"]>;

/* -------------------------------------------------------------------------- */
/*  Style context. DataTable provides variant/size so column-file components  */
/*  (like PlainHeader) can match the table without prop drilling.             */
/* -------------------------------------------------------------------------- */

const DataTableStyleContext = React.createContext<{
    variant: DataTableVariant;
    size: DataTableSize;
}>({ variant: "card", size: "md" });

/** Use for non-sortable column headers so they match the sortable ones. */
export const PlainHeader = ({
    title,
    className,
}: {
    title: string;
    className?: string;
}) => {
    const { size } = React.useContext(DataTableStyleContext);
    return <span className={cn(headerTextVariants({ size }), "text-muted-foreground!", className)}>{title}</span>;
};

/* -------------------------------------------------------------------------- */
/*  Footers. Pick one with the `footer` prop. Add new ones to FOOTERS.        */
/* -------------------------------------------------------------------------- */

export type DataTablePagination = {
    page: number;
    limit: number;
    totalPages: number;
    total?: number;
};

type FooterProps = {
    pagination: DataTablePagination;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    showRefreshButton?: boolean;
    limitOptions: number[];
    noun: [singular: string, plural: string];
};

const iconButtonVariants = cva(
    "inline-flex items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                ghost: "hover:bg-muted hover:text-foreground",
                outline: "border border-border hover:bg-muted hover:text-foreground",
                plain: "hover:text-foreground",
            },
            size: {
                sm: "size-6",
                md: "size-7",
                lg: "size-8",
            },
        },
        defaultVariants: { variant: "ghost", size: "md" },
    },
);

const iconSizes = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

type IconButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof iconButtonVariants>;

function IconButton({ className, variant, size, ...props }: IconButtonProps) {
    const ctx = React.useContext(DataTableStyleContext);
    return (
        <button
            type="button"
            className={cn(iconButtonVariants({ variant, size: size ?? ctx.size }), className)}
            {...props}
        />
    );
}

function RefreshButton({
    onRefresh,
    isRefreshing,
    variant,
    size,
}: Pick<FooterProps, "onRefresh" | "isRefreshing"> &
    VariantProps<typeof iconButtonVariants>) {
    const ctx = React.useContext(DataTableStyleContext);
    if (!onRefresh) return null;
    const s = size ?? ctx.size;
    return (
        <IconButton onClick={onRefresh} aria-label="Refresh" variant={variant} size={s}>
            <RefreshCw className={cn(iconSizes[s], isRefreshing && "animate-spin")} />
        </IconButton>
    );
}

function RowsSelect({ pagination, onLimitChange, limitOptions }: Pick<FooterProps, "pagination" | "onLimitChange" | "limitOptions">) {
    if (!onLimitChange) return null;
    return (
        <div className="flex items-center gap-2">
            <span>Rows</span>
            <Select
                value={String(pagination.limit)}
                onValueChange={(v) => v && onLimitChange(Number(v))}
            >
                <SelectTrigger size="sm">
                    <SelectValue className={"text-xs"} />
                </SelectTrigger>
                <SelectContent align="end" alignItemWithTrigger={false} className="w-20">
                    {limitOptions.map((n) => (
                        <SelectItem className={"text-xs"} key={n} value={String(n)}>
                            {n}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

// 1 … 4 5 [6] 7 8 … 20
function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const keep = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out: (number | "ellipsis")[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push("ellipsis");
        out.push(p);
    });
    return out;
}

const count = (n: number, noun: [string, string]) => `${n.toLocaleString()} ${n === 1 ? noun[0] : noun[1]}`;

/** "↻  1 row        « ‹ 1 / 1 › »        Rows [10]"  (settings design) */
function CompactFooter(p: FooterProps) {
    const { page, totalPages, total } = p.pagination;
    const go = (n: number) => p.onPageChange?.(Math.min(Math.max(1, n), totalPages));
    return (
        <div className="grid w-full grid-cols-3 items-center">
            <div className="flex items-center gap-2">
                <RefreshButton {...p} />
                {typeof total === "number" && <span>{count(total, p.noun)}</span>}
            </div>
            <div className="flex items-center justify-center gap-1">
                <IconButton onClick={() => go(1)} disabled={page <= 1} aria-label="First page">
                    <ChevronsLeft className="size-4" />
                </IconButton>
                <IconButton onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
                    <ChevronLeft className="size-4" />
                </IconButton>
                <span className="mx-2 tabular-nums">
                    <span className="font-medium text-foreground">{page}</span> / {totalPages}
                </span>
                <IconButton onClick={() => go(page + 1)} disabled={page >= totalPages} aria-label="Next page">
                    <ChevronRight className="size-4" />
                </IconButton>
                <IconButton onClick={() => go(totalPages)} disabled={page >= totalPages} aria-label="Last page">
                    <ChevronsRight className="size-4" />
                </IconButton>
            </div>
            <div className="flex justify-end">
                <RowsSelect {...p} />
            </div>
        </div>
    );
}

/** "↻  1 total" with prev/next only when there is more than one page  (partners design) */
function TotalFooter(p: FooterProps) {
    const { page, totalPages, total } = p.pagination;
    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
                {p.showRefreshButton && <RefreshButton {...p} />}
                {typeof total === "number" && <span>{total.toLocaleString()} total</span>}
            </div>
            <div className="flex items-center gap-3">
                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <IconButton onClick={() => p.onPageChange?.(page - 1)} disabled={page <= 1} aria-label="Previous page">
                            <ChevronLeft className="size-4" />
                        </IconButton>
                        <span className="tabular-nums">
                            {page} / {totalPages}
                        </span>
                        <IconButton onClick={() => p.onPageChange?.(page + 1)} disabled={page >= totalPages} aria-label="Next page">
                            <ChevronRight className="size-4" />
                        </IconButton>
                    </div>
                )}
                <RowsSelect {...p} />
            </div>
        </div>
    );
}

/** "Rows [20]            Prev 1 2 … 9 Next"  (numbered pages) */
function PagerFooter(p: FooterProps) {
    const { page, totalPages } = p.pagination;
    const pages = getVisiblePages(page, totalPages);
    return (
        <div className="flex w-full items-center justify-between">
            <RowsSelect {...p} />
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => p.onPageChange?.(page - 1)}
                    disabled={page <= 1}
                    className="px-2 py-1 disabled:opacity-50"
                >
                    Prev
                </button>
                {pages.map((n, i) =>
                    n === "ellipsis" ? (
                        <span key={`e${i}`} className="px-1">…</span>
                    ) : (
                        <button
                            key={n}
                            type="button"
                            onClick={() => p.onPageChange?.(n)}
                            className={cn(
                                "rounded px-3 py-1",
                                n === page && "font-medium text-foreground",
                            )}
                        >
                            {n}
                        </button>
                    ),
                )}
                <button
                    type="button"
                    onClick={() => p.onPageChange?.(page + 1)}
                    disabled={page >= totalPages}
                    className="px-2 py-1 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

const FOOTERS = {
    compact: CompactFooter,
    total: TotalFooter,
    pager: PagerFooter,
} as const;

export type DataTableFooter = keyof typeof FOOTERS | "none";

const skeletonVariants = cva("", {
    variants: {
        variant: {
            bar: "w-full rounded-md",        // full-width block (old behaviour)
            text: "rounded-full",            // text-like line, width varies per column
            pill: "w-16 rounded-full",       // short fixed pill (badges, counts)
        },
        size: {
            sm: "h-3",
            md: "h-4",
            lg: "h-5",
        },
    },
    defaultVariants: { variant: "bar", size: "md" },
});

export type DataTableSkeleton = NonNullable<VariantProps<typeof skeletonVariants>["variant"]>;
export type SkeletonKind = DataTableSkeleton | "avatar" | "none";

// text-skeleton widths cycle by column index so rows don't look uniform
const TEXT_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-4/5"] as const;

function SkeletonCell({
    variant,
    size,
    index,
    kind,
}: {
    variant: DataTableSkeleton;
    size: DataTableSize;
    index: number;
    kind?: SkeletonKind; // per-column override from column meta
}) {
    const k = kind ?? variant;
    if (k === "none") return null;
    if (k === "avatar") {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="size-7 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-3/4 rounded-full" />
                    <Skeleton className="h-2.5 w-1/2 rounded-full" />
                </div>
            </div>
        );
    }
    return (
        <Skeleton
            className={cn(
                skeletonVariants({ variant: k, size }),
                k === "text" && TEXT_WIDTHS[index % TEXT_WIDTHS.length],
            )}
        />
    );
}

/* -------------------------------------------------------------------------- */
/*  DataTable                                                                 */
/* -------------------------------------------------------------------------- */

export type DataTableProps<TFeatures extends TableFeatures, TData extends RowData> =
    StyleProps & {
        table: ReactTableType<TFeatures, TData>;
        loading?: boolean;
        skeletonRows?: number;
        className?: string;

        // toolbar slot rendered above the table, inside the root
        toolbar?: React.ReactNode;

        // footer
        footer?: DataTableFooter;
        pagination?: DataTablePagination;
        onPageChange?: (page: number) => void;
        onLimitChange?: (limit: number) => void;
        onRefresh?: () => void;
        isRefreshing?: boolean;
        limitOptions?: number[];
        noun?: [singular: string, plural: string];

        showRefreshButton?: boolean;
        // rows
        onRowClick?: (row: Row<TFeatures, TData>) => void;
        selectedRowIndex?: number | null;
        processingStateText?: string | null;
        isError?: boolean;
        isEmpty?: boolean;
        errorComponent?: React.ReactNode;
        emptyStateComponent?: React.ReactNode;
        skeletonVariant?: DataTableSkeleton;
        hideFooter?: boolean
    };

// getVisibleCells / size only exist when those features are registered
const getColumnSize = (columnDef: unknown) => (columnDef as { size?: number }).size;

function getRowCells<TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
) {
    const r = row as unknown as {
        getVisibleCells?: () => ReturnType<Row<TFeatures, TData>["getAllCells"]>;
    };
    return r.getVisibleCells ? r.getVisibleCells() : row.getAllCells();
}

const hoverDisabled = (cells: { column: { columnDef: { meta?: unknown } } }[]) =>
    cells.some(
        (c) => (c.column.columnDef.meta as { disableHover?: boolean } | undefined)?.disableHover,
    );

export function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
    table,
    variant = "card",
    size = "md",
    loading = false,
    skeletonRows = 5,
    skeletonVariant = "bar",
    className,
    toolbar,
    footer = "none",
    pagination,
    onPageChange,
    onLimitChange,
    onRefresh,
    isRefreshing,
    limitOptions = [10, 20, 50, 100],
    noun = ["row", "rows"],
    onRowClick,
    selectedRowIndex,
    processingStateText,
    isEmpty,
    isError,
    errorComponent,
    emptyStateComponent,
    showRefreshButton,
    hideFooter = false
}: DataTableProps<TFeatures, TData>) {
    const colSpan = table.getAllLeafColumns().length;
    const rows = table.getRowModel().rows;

    // if (!loading && rows.length === 0 && emptyStateComponent) {
    //     return <div className="h-full">{emptyStateComponent}</div>;
    // }

    const FooterComponent = footer !== "none" && pagination ? FOOTERS[footer] : null;

    // NEW: selected-row highlight. Plain rows paint on cells, others on the <tr>.
    const selectedClass = variant === "plain" ? "[&>td]:bg-accent" : "bg-accent";

    return (
        <DataTableStyleContext.Provider value={{ variant: variant ?? "card", size: size ?? "md" }}>
            <div className={cn(rootVariants({ variant }), className)}>
                {toolbar && <div className="pl-3 pb-4 pt-2">{toolbar}</div>}

                {/* CHANGED: table variant (border-separate + spacing for plain) */}
                <Table className={tableVariants({ variant })}>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id} className="hover:bg-transparent">
                                {group.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: getColumnSize(header.column.columnDef) }}
                                        className={headVariants({ variant, size })}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: skeletonRows }).map((_, r) => (
                                <TableRow key={r} className={rowVariants({ variant })}>
                                    {table.getAllLeafColumns().map((col, c) => (
                                        <TableCell
                                            key={col.id}
                                            style={{ width: getColumnSize(col.columnDef) }}
                                            className={cellVariants({ variant, size })}
                                        >
                                            <SkeletonCell
                                                variant={skeletonVariant}
                                                size={size ?? "md"}
                                                index={c + r}
                                                kind={(col.columnDef.meta as { skeleton?: SkeletonKind } | undefined)?.skeleton}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {processingStateText && (
                                    <TableRow className={rowVariants({ variant })}>
                                        <TableCell colSpan={colSpan} className={cellVariants({ variant, size })}>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Spinner className="size-4" />
                                                {processingStateText}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {isError && errorComponent && (
                                    <TableRow className={cn(rowVariants({ variant }), "h-[calc(40vh-100px)] hover:bg-transparent")}>
                                        <TableCell colSpan={colSpan} className={cellVariants({ variant, size })}>
                                            <div className="h-full text-center">{errorComponent}</div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {isEmpty && !isError && emptyStateComponent && (
                                    <TableRow className={cn(rowVariants({ variant }), "h-[calc(40vh-100px)] hover:bg-transparent")}>
                                        <TableCell colSpan={colSpan} className={cellVariants({ variant, size })}>
                                            <div className="h-full text-center">{emptyStateComponent}</div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {rows.map((row, i) => {
                                    const cells = getRowCells(row);
                                    const clickable = !!onRowClick && !hoverDisabled(row.getAllCells());
                                    return (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick?.(row)}
                                            className={cn(
                                                rowVariants({ variant, clickable }),
                                                i === selectedRowIndex && selectedClass,
                                            )}
                                        >
                                            {cells.map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{ width: getColumnSize(cell.column.columnDef) }}
                                                    className={cellVariants({ variant, size })}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </>
                        )}
                    </TableBody>
                </Table>

                {FooterComponent && pagination && !hideFooter && (
                    <div className={footerVariants({ variant, size })}>
                        <FooterComponent
                            pagination={pagination}
                            onPageChange={onPageChange}
                            onLimitChange={onLimitChange}
                            onRefresh={onRefresh}
                            isRefreshing={isRefreshing}
                            limitOptions={limitOptions}
                            noun={noun}
                            showRefreshButton={showRefreshButton}
                        />
                    </div>
                )}
            </div>
        </DataTableStyleContext.Provider>
    );
}

export { rootVariants, tableVariants, headVariants, headerTextVariants, rowVariants, cellVariants, footerVariants };