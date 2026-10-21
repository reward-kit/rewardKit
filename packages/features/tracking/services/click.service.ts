import { db } from "@rewardkit/packages/db/db";

export type CreateClickInput = {
    programId: string;
    partnerId: string;
    linkId: string;
    visitorId: string;
    code: string;
    page?: string | null;
    param?: string | null;
    referrer?: string | null;
};

export class ClickService {
    /**
     * Plain insert — clicks are immutable events, so there is nothing to merge.
     * `_id` (clk_*) and timestamps come from the schema defaults.
     */
    async createClick(input: CreateClickInput) {
        return db.click.create({
            programId: input.programId,
            partnerId: input.partnerId,
            linkId: input.linkId,
            visitorId: input.visitorId,
            code: input.code,
            page: input.page ?? null,
            param: input.param ?? null,
            referrer: input.referrer ?? null,
        });
    }

    /** total_clicks for a single partner (partner details endpoint). */
    async getStatsByPartner(programId: string, partnerId: string) {
        const total_clicks = await db.click.countDocuments({ programId, partnerId });
        return { total_clicks };
    }

    /** total_clicks for many partners in one grouped aggregation (list endpoint, no N+1). */
    async getCountsByPartnerIds(programId: string, partnerIds: string[]): Promise<Map<string, number>> {
        if (!programId || partnerIds.length === 0) return new Map();

        const rows = await db.click
            .aggregate<{ _id: string; count: number }>([
                { $match: { programId, partnerId: { $in: partnerIds } } },
                { $group: { _id: "$partnerId", count: { $sum: 1 } } },
            ])
            .option({ maxTimeMS: 5000 });

        const counts = new Map<string, number>();
        for (const row of rows) counts.set(row._id, row.count);
        return counts;
    }
}

export const clickService = new ClickService();
