"use client";

import { useMemo, useState } from "react";
import { useTable } from "@rewardkit/packages/ui/components/table";
import { DataTable } from "@rewardkit/packages/ui/components/data.table";
import { Button } from "@rewardkit/packages/ui/components/button";
import { linkColumns, type LinkRow, linkTableFeatures } from "./link.column.table";
import { usePartnerLinks } from "../../hooks/usePartnerLinks";
import { UrlParameter } from "@rewardkit/packages/types/program/program.schema";
import { Small } from "@rewardkit/packages/ui/components/typography";
import { LinkCreateModal } from "../create-link/link-create.modal";
import { Plus } from "lucide-react";

export const PartnerLinksTable = ({
    partnerId,
    currency = "USD",
    urlParams,
    websiteUrl
}: {
    partnerId: string;
    currency?: string;
    websiteUrl?: string
    /** parameters the program allows for tracking links */
    urlParams?: UrlParameter[] | null;
}) => {
    const {
        links, page, setPage, pageSize, setPageSize, totalPages, total,
        isLoading, isFetching, isError, error, refetch,
    } = usePartnerLinks({ partnerId });
    const [createOpen, setCreateOpen] = useState(false)

    const columns = useMemo(() => linkColumns({ currency }), [currency]);
    const data = useMemo(() => links as LinkRow[], [links]);
    const isEmpty = !isLoading && data.length === 0;

    const table = useTable<typeof linkTableFeatures, LinkRow>({
        features: linkTableFeatures,
        columns,
        data,
        getRowId: (row) => row.id ?? row._id ?? "",
        initialState: { sorting: [{ id: "createdAt", desc: true }] },
    });

    return (
        <div className="flex h-full w-full flex-col">
            <DataTable
                table={table}
                variant="plain"
                footer="total"
                loading={isLoading}
                toolbar={
                    <div className="flex w-full items-center justify-between gap-2">
                        <Small>Links</Small>
                        <Button variant="secondary" size="sm" className="rounded-[12px] h-8 pr-2.5! px-2" onClick={() => setCreateOpen(true)}>
                            <Plus />
                            Create link
                        </Button>
                    </div>
                }
                pagination={{ page, limit: pageSize, totalPages, total }}
                onPageChange={setPage}
                onLimitChange={(n) => {
                    setPageSize(n);
                    setPage(1);
                }}
                onRefresh={refetch}
                isRefreshing={isFetching}
                size="sm"
                showRefreshButton={false}
                isError={isError}
                isEmpty={isEmpty}
                errorComponent={
                    <div className="text-center text-sm space-y-4">
                        <p className="text-muted-foreground">{error?.message ?? "Failed to load links."}</p>
                        <Button
                            type="button"
                            onClick={() => refetch()}
                            size="sm"
                            className="rounded-full"
                            variant="outline"
                        >
                            Retry
                        </Button>
                    </div>
                }
                emptyStateComponent={
                    <p className="text-muted-foreground">
                        No links yet. Create one for this partner.
                    </p>
                }
            />
            <LinkCreateModal
                partnerId={partnerId}
                urlParams={urlParams}
                websiteUrl={websiteUrl}
                open={createOpen}
                onOpenChange={setCreateOpen}
            />
        </div>
    );
};
