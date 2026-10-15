import { z } from "zod";
import { useAppForm } from "@rewardkit/packages/ui/components/form";
import { PARTNER_STATUS, type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema";
import { PartnerStatusValues, ZPartnerStatus } from "@rewardkit/packages/types/partner/partner.validation";
import { PARTNER_STATUS_OPTIONS, PARTNER_STATUS_STYLE } from "../../contants/status";
import React from "react";
import { useSelector, useStore } from "@tanstack/react-form-nextjs";
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter";

const REASON_STATUSES: string[] = [PARTNER_STATUS.SUSPENDED, PARTNER_STATUS.REJECTED];

type StatusFieldValue = z.input<typeof ZPartnerStatus>["status"]

interface PartnerStatusFormProps {
    id?: string;
    partner?: Pick<PartnerResource, "status" | "suspendedReason" | "rejectedReason"> | null;
    onSubmit: (values: PartnerStatusValues) => void;
    onDirtyChange?: (dirty: boolean) => void;
    onStatusChange?: (status: StatusFieldValue) => void;
}

export const PartnerStatusForm = ({
    id = "partner-status-form",
    partner,
    onSubmit,
    onDirtyChange,
    onStatusChange,
}: PartnerStatusFormProps) => {
    const current = partner?.status;
    const isAdminStatus = current === PARTNER_STATUS.ACTIVE
        || current === PARTNER_STATUS.SUSPENDED
        || current === PARTNER_STATUS.REJECTED;
    const reason = (current === PARTNER_STATUS.SUSPENDED ? partner?.suspendedReason
        : current === PARTNER_STATUS.REJECTED ? partner?.rejectedReason
            : "") ?? ""

    const defaultValues: z.input<typeof ZPartnerStatus> = {
        status: isAdminStatus ? current : null,
        reason,
    };

    const form = useAppForm({
        defaultValues,
        validators: {
            onChange: ZPartnerStatus,
        },
        onSubmit: ({ value }) => {
            onSubmit(ZPartnerStatus.parse(value));
        },
    });

    const isDefaultValue = useSelector(form.store, (s) => s.isDefaultValue);

    React.useEffect(() => {
        onDirtyChange?.(!isDefaultValue);
    }, [isDefaultValue, onDirtyChange]);

    return (
        <form
            id={id}
            className="flex flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppField
                name="status"
                listeners={{
                    onChange: ({ value }) => {
                        form.setFieldValue("reason", "");
                        onStatusChange?.(value);
                    },
                }}
                children={(field) => (
                    <field.SelectField
                        label="Status"
                        hideLabel
                        placeholder="Select a status"
                        options={PARTNER_STATUS_OPTIONS}
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.values.status}>
                {(status) =>
                    status && REASON_STATUSES.includes(status) ? (
                        <div className="mt-6">
                            <form.AppField
                                name="reason"
                                children={(field) => (
                                    <field.TextareaField label="Reason (optional)" />
                                )}
                            />
                        </div>
                    ) : null
                }
            </form.Subscribe>
            <form.Subscribe selector={(state) => state.isDefaultValue}>
                {(isDefaultValue) => (
                    <DirtyReporter isDefaultValue={isDefaultValue} onDirtyChange={onDirtyChange} />
                )}
            </form.Subscribe>
        </form>
    );
};