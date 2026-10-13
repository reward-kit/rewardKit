import { z } from "zod";
import { useAppForm } from "@rewardkit/packages/ui/components/form";
import { PARTNER_STATUS, type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema";
import { PartnerStatusValues, ZPartnerStatus } from "@rewardkit/packages/types/partner/partner.validation";
import { PARTNER_STATUS_OPTIONS, PARTNER_STATUS_STYLE } from "../../contants/status";

const REASON_STATUSES: string[] = [PARTNER_STATUS.SUSPENDED, PARTNER_STATUS.REJECTED];

interface PartnerStatusFormProps {
    id?: string;
    partner?: Pick<PartnerResource, "status" | "suspendedReason" | "rejectedReason"> | null;
    onSubmit: (values: PartnerStatusValues) => void;
}

export const PartnerStatusForm = ({
    id = "partner-status-form",
    partner,
    onSubmit,
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
                    onChange: () => form.setFieldValue("reason", ""),
                }}
                children={(field) => (
                    <field.SelectField
                        label="Status"
                        placeholder="Select a status"
                        options={PARTNER_STATUS_OPTIONS}
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.values.status}>
                {(status) =>
                    status ? (
                        <>
                            <p className="text-xs text-muted-foreground">
                                {PARTNER_STATUS_STYLE[status].optionSelectionHint}
                            </p>

                            {REASON_STATUSES.includes(status) && (
                                <div className="mt-6">
                                    <form.AppField
                                        name="reason"
                                        children={(field) => (
                                            <field.TextareaField label="Reason (optional)" />
                                        )}
                                    />
                                </div>
                            )}
                        </>
                    ) : null
                }
            </form.Subscribe>
        </form>
    );
};