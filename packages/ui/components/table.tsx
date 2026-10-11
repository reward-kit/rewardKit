"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  flexRender,
  type Column,
  type Row,
  type RowData,
  type Table as ReactTableType,
  type TableFeatures,
} from "@tanstack/react-table";

import { cn } from "@rewardkit/lib/utils";
import type { PaginationMeta } from "@rewardkit/packages/types/paginated-response";
import { ExtraSmall } from "./typography";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Tabs, TabsList, TabsTrigger, } from "./tabs";
import { Badge } from "@rewardkit/components/reui/badge";

/* ---------------------------------- Sorting --------------------------------- */

type SortableColumn = {
  getIsSorted: () => false | "asc" | "desc";
  getToggleSortingHandler: () => ((event: unknown) => void) | undefined;
};

type SortableHeaderProps = {
  column: SortableColumn;
  title: string;
  className?: string;
};

export function SortableHeader({ column, title, className }: SortableHeaderProps) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "flex w-full cursor-pointer select-none items-center text-(--header-text-size) gap-1 p-0 font-normal text-muted-foreground/70 hover:opacity-80",
        className,
      )}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="size-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3" />
      ) : (
        <ChevronsUpDown className="size-3 opacity-40 hidden" />
      )}
    </button>
  );
}

/* ------------------------------ Base primitives ----------------------------- */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full max-w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b-0", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 whitespace-nowrap px-2 text-left align-middle text-xs font-normal text-slate-600 has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "whitespace-nowrap p-2 align-middle has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function TableSkeleton({
  columns,
  rows = 2,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className={cn(
            "border-b-0 bg-card hover:bg-card-secondary",
            rowIdx === 0 &&
            "[&>td:first-child]:rounded-tl-2xl [&>td:last-child]:rounded-tr-2xl",
            rowIdx === rows - 1 &&
            "[&>td:first-child]:rounded-bl-2xl [&>td:last-child]:rounded-br-2xl",
          )}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx} className="py-3">
              <Skeleton className="h-6 w-full rounded-lg" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/* --------------------------------- Helpers ---------------------------------- */

// 1 … 4 5 [6] 7 8 … 20
function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

const isHoverDisabled = (cells: { column: { columnDef: { meta?: unknown } } }[]) =>
  cells.some((c) => (c.column.columnDef.meta as { disableHover?: boolean } | undefined)?.disableHover);

const getColumnSize = (columnDef: unknown) =>
  (columnDef as { size?: number }).size;

// getVisibleCells only exists when columnVisibilityFeature is registered.
// Use it when present, otherwise fall back to all cells.
function getRowCells<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
) {
  const r = row as unknown as {
    getVisibleCells?: () => ReturnType<Row<TFeatures, TData>["getAllCells"]>;
  };
  return r.getVisibleCells ? r.getVisibleCells() : row.getAllCells();
}

/* ------------------------------ Shared renderers ---------------------------- */

type GridProps<TFeatures extends TableFeatures, TData extends RowData> = {
  table: ReactTableType<TFeatures, TData>;
  loading: boolean;
  skeletonRows: number;
  processingStateText?: string | null;
  onRowClick?: (row: Row<TFeatures, TData>) => void;
  selectedRowIndex?: number | null;
  headClassName: string;
  rowClassName: string;
  cellClassName: string;
  bodyClassName?: string;
};

function Grid<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  loading,
  skeletonRows,
  processingStateText,
  onRowClick,
  selectedRowIndex,
  headClassName,
  rowClassName,
  cellClassName,
  bodyClassName,
}: GridProps<TFeatures, TData>) {
  const colSpan = table.getAllLeafColumns().length;

  return (
    <Table className="px-0">
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id} className="hover:bg-transparent">
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{ width: getColumnSize(header.column.columnDef) }}
                className={headClassName}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {loading ? (
        <TableBody>
          <TableSkeleton columns={colSpan} rows={skeletonRows} />
        </TableBody>
      ) : (
        <TableBody className={cn("bg-table", bodyClassName)}>
          {processingStateText && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Spinner className="size-4" />
                  {processingStateText}
                </div>
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.map((row, rowIndex) => {
            const noHover = isHoverDisabled(row.getAllCells());
            return (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  rowClassName,
                  noHover && "cursor-default hover:bg-transparent",
                  rowIndex === selectedRowIndex && "bg-accent hover:bg-accent/30",
                )}
              >
                {getRowCells(row).map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: getColumnSize(cell.column.columnDef) }}
                    className={cellClassName}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      )}
    </Table>
  );
}


export type TableTab<K extends string = string> = {
  key: K;
  label: React.ReactNode;
  count?: number;
  disabled?: boolean;
};

export type TableTabsProps<K extends string = string> = {
  value: K;
  onChange: (value: K) => void;
  tabs: TableTab<K>[];
  variant?: "pill" | "underline";
  className?: string;
};

export function TableTabs<K extends string = string>({
  value,
  onChange,
  tabs,
  variant = "pill",
  className,
}: TableTabsProps<K>) {
  return (
    // No TabsContent: the server filters the data, so the tabs only drive state
    <Tabs value={value} onValueChange={(v) => onChange(v as K)}>
      <TabsList
        variant={variant === "underline" ? "line" : "default"}
        className={className}
      >
        {tabs.map((tab) => (
          <TabsTrigger className={cn(variant == "underline" && "py-0")} key={tab.key} value={tab.key} disabled={tab.disabled}>
            {tab.label}
            {typeof tab.count === "number" && (
              <Badge size={"sm"} variant={"secondary"}>
                {tab.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

/* ------------------------------- PaginatedTable ----------------------------- */

export type PaginatedTableProps<TFeatures extends TableFeatures, TData extends RowData> = {
  table: ReactTableType<TFeatures, TData>;
  loading?: boolean;
  pagination: Pick<
    PaginationMeta,
    "page" | "totalPages" | "limit" | "hasNextPage" | "hasPrevPage"
  >;
  next: () => void;
  prev: () => void;
  goToPage?: (page: number) => void; // enables jumping straight to a page number
  changeLimit?: (limit: number) => void;
  processingStateText?: string | null;
  onRowClick?: (row: Row<TFeatures, TData>) => void;
  hidePagination?: boolean;
  emptyStateComponent?: React.ReactNode;
  selectedRowIndex?: number | null;
};

export function PaginatedTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  loading = false,
  pagination,
  next,
  prev,
  goToPage,
  changeLimit,
  selectedRowIndex,
  hidePagination = false,
  processingStateText,
  emptyStateComponent,
  onRowClick,
}: PaginatedTableProps<TFeatures, TData>) {
  const { page, totalPages, limit, hasPrevPage, hasNextPage } = pagination;
  const pages = getVisiblePages(page, totalPages);

  if (!loading && table.getRowModel().rows.length === 0 && emptyStateComponent) {
    return <div className="h-full">{emptyStateComponent}</div>;
  }

  const handlePageClick = (p: number) => {
    if (goToPage) return goToPage(p);
    // fallback when goToPage isn't provided: only adjacent pages work
    if (p === page - 1) prev();
    if (p === page + 1) next();
  };

  return (
    <div className="mb-2 w-full border border-border-1/60 pt-0">
      <div className="w-full overflow-hidden">
        <Grid
          table={table}
          loading={loading}
          skeletonRows={5}
          processingStateText={processingStateText}
          onRowClick={onRowClick}
          selectedRowIndex={selectedRowIndex}
          headClassName="h-10.5 text-[0.75rem] font-medium text-muted-foreground/50 first:pl-4"
          rowClassName="group cursor-pointer font-medium transition-colors hover:bg-accent/30 [&>td:first-child]:pl-4"
          cellClassName="py-2.5 text-sm"
          bodyClassName="border-b border-border last:border-b-transparent"
        />
      </div>

      {!hidePagination && (
        <div className="flex w-full items-center justify-between p-3">
          {changeLimit ? (
            <div className="flex items-center gap-2">
              <ExtraSmall className="text-muted-foreground">Rows per page</ExtraSmall>
              <Select
                value={String(limit)}
                onValueChange={(value) => changeLimit(Number(value))}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} className="w-28">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prev}
              disabled={!hasPrevPage}
              className="px-2 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e${i}`} className="px-1 text-sm text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageClick(p)}
                  className={cn("rounded px-3 py-1 text-sm", p === page && "font-semibold")}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={next}
              disabled={!hasNextPage}
              className="px-2 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- SimpleTable ------------------------------ */

export type SimpleTableProps<TFeatures extends TableFeatures, TData extends RowData> = {
  table: ReactTableType<TFeatures, TData>;
  loading?: boolean;
  toolbar?: React.ReactNode;
  emptyStateComponent?: React.ReactNode;
  processingStateText?: string | null;
  onRowClick?: (row: Row<TFeatures, TData>) => void;
  selectedRowIndex?: number | null;
  className?: string;
};

export function SimpleTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  loading = false,
  toolbar,
  emptyStateComponent,
  processingStateText,
  onRowClick,
  selectedRowIndex,
  className,
}: SimpleTableProps<TFeatures, TData>) {
  if (!loading && table.getRowModel().rows.length === 0 && emptyStateComponent) {
    return <>{emptyStateComponent}</>;
  }

  return (
    <div
      className={cn(
        "mb-2 w-full rounded-lg border bg-card px-2 pb-2 pt-0 shadow-subtle",
        className,
      )}
    >
      {toolbar && <div className="p-3 px-2">{toolbar}</div>}
      <Grid
        table={table}
        loading={loading}
        skeletonRows={2}
        processingStateText={processingStateText}
        onRowClick={onRowClick}
        selectedRowIndex={selectedRowIndex}
        headClassName="text-xs font-medium tracking-wide text-muted-foreground"
        rowClassName="cursor-pointer transition-colors hover:bg-accent [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
        cellClassName="py-3 text-gray-700"
      />
    </div>
  );
}

export * from "@tanstack/react-table";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};