"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTable } from "@rewardkit/packages/ui/components/table";
import {
    partnerColumns,
    type PartnerRow,
    partnerTableFeatures,
} from "./partner.column.table";
import { DataTable } from "@rewardkit/packages/ui/components/data.table";
import { Button } from "@rewardkit/packages/ui/components/button";
import { useInvitedPartners } from "../../hooks/useInvitedPartners";

export const PartnerInvitedListTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        partners, page, setPage, pageSize, setPageSize, totalPages, total,
        isLoading, isFetching, isError, error, refetch,
    } = useInvitedPartners({ syncUrl: true });

    const columns = useMemo(() => partnerColumns({ currency: "USD" }), []);
    const data = useMemo(() => partners as PartnerRow[], [partners]);
    const isEmpty = !isLoading && data.length === 0;

    const table = useTable<typeof partnerTableFeatures, PartnerRow>({
        features: partnerTableFeatures,
        columns,
        data,
        getRowId: (row) => row.id ?? row._id ?? "",
        initialState: { sorting: [{ id: "createdAt", desc: true }] },
    });

    const openPartner = (id: string) => {
        const qs = searchParams.toString();
        router.push(`/w/partners/partner/${id}${qs ? `?${qs}` : ""}`, { scroll: false });
    };

    return (
        <div className="flex h-full w-full flex-col">
            <DataTable
                table={table}
                variant="grid"
                footer="total"
                loading={isLoading}
                pagination={{ page, limit: pageSize, totalPages, total }}
                onPageChange={setPage}
                onLimitChange={setPageSize}
                onRefresh={refetch}
                isRefreshing={isFetching}
                size="sm"
                onRowClick={(row) => {
                    const id = row.original.id ?? row.original._id;
                    if (id) openPartner(id);
                }}
                showRefreshButton={false}
                isError={isError}
                isEmpty={isEmpty}
                errorComponent={
                    <div className="text-center text-sm space-y-4">
                        <p className="text-muted-foreground">{error?.message ?? "Failed to load partners."}</p>
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
                emptyStateComponent={<p>No data</p>}
            />
        </div>
    );
};