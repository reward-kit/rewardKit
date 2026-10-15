import { z } from "zod";
import { useAppForm } from "@rewardkit/packages/ui/components/form";
import {
    PAYOUT_DETAILS_SCHEMA,
    PAYOUT_METHOD,
    PayoutDetails,
    PayoutMethod,
} from "@rewardkit/packages/types/payout/payout.schema";
import { type PartnerResource } from "@rewardkit/packages/types/partner/partner.schema";
import { PAYOUT_METHOD_OPTIONS } from "@rewardkit/packages/features/payouts/constant";
import { PartnerPayoutValues, ZPartnerPayout } from "@rewardkit/packages/types/partner/partner.validation";
import { DirtyReporter } from "@rewardkit/packages/ui/components/form/dirty-reporter";

export interface PayoutMethodValues {
    payoutMethod: PayoutMethod;
    payoutDetails: PayoutDetails;
}

type DetailFieldName = "email";

const DETAIL_FIELDS: Record<PayoutMethod, { name: DetailFieldName; label: string; type?: string }[]> = {
    [PAYOUT_METHOD.PAYPAL]: [{ name: "email", label: "PayPal email", type: "email" }],
    [PAYOUT_METHOD.WISE]: [{ name: "email", label: "Wise email", type: "email" }],
};

interface PayoutMethodFormProps {
    id?: string;
    partner?: Pick<PartnerResource, "payoutMethod" | "payoutDetails"> | null;
    onSubmit: (values: PartnerPayoutValues) => void;
    onDirtyChange?: (dirty: boolean) => void
}

export const PayoutMethodForm = ({
    id = "payout-method-form",
    partner,
    onSubmit,
    onDirtyChange
}: PayoutMethodFormProps) => {

    const defaultValues: z.input<typeof ZPartnerPayout> = {
        payoutMethod: partner?.payoutMethod ?? null,
        payoutDetails: partner?.payoutDetails ?? null,
    };

    const form = useAppForm({
        defaultValues,
        validators: {
            onChange: ZPartnerPayout,
        },
        onSubmit: ({ value }) => {
            const method = value.payoutMethod as PayoutMethod
            const parsed = PAYOUT_DETAILS_SCHEMA[method].parse(value.payoutDetails)
            onSubmit({ payoutMethod: method, payoutDetails: parsed })
        },
    });

    return (
        <form
            id={id}
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppField
                name="payoutMethod"
                listeners={{
                    onChange: () => form.setFieldValue("payoutDetails", { email: "" }),
                }}
                children={(field) => (
                    <field.SelectField
                        hideLabel
                        label="Payout method"
                        placeholder="Select a method"
                        options={PAYOUT_METHOD_OPTIONS}
                    />
                )}
            />

            <form.Subscribe selector={(state) => state.values.payoutMethod as PayoutMethod | ""}>
                {(method) =>
                    method
                        ? DETAIL_FIELDS[method]?.map((f) => (
                            <form.AppField
                                key={`${method}-${f.name}`}
                                name={`payoutDetails.${f.name}`}
                                children={(field) => <field.TextField hideLabel autoComplete="false" placeholder={f.label} label={f.label} type={f.type} />}
                            />
                        ))
                        : null
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