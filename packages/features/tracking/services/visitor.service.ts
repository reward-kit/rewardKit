import { db } from "@rewardkit/packages/db/db";
import { generateId, ID_PREFIX } from "@rewardkit/packages/db/lib/id";
import { VISITOR_STATUS } from "@rewardkit/packages/types/visitor/visitor.schema";

export type UpsertVisitorInput = {
    programId: string;
    partnerId: string;
    /** The click that first brought this visitor in; only persisted when the visitor row is inserted. */
    clickId?: string | null;
    cookieDuration?: number | null;
    countryCode?: string | null;
    deviceManufacturer?: string | null;
    deviceModel?: string | null;
    deviceOs?: string | null;
    deviceOsVersion?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    pageUrl?: string | null;
    visitorId?: string | null;
    now?: string;
};

const VISITOR_ID_PATTERN = /^vst_[A-Za-z0-9_-]+$/;

export class VisitorService {
    /**
     * Accepts a client-supplied id (cookie) only when it looks like one of ours;
     * anything else falls back to a freshly generated id.
     */
    resolveVisitorId(provided?: string | null): string {
        return provided && VISITOR_ID_PATTERN.test(provided) ? provided : generateId(ID_PREFIX.visitor);
    }

    /**
     * Atomic upsert: a single findOneAndUpdate with upsert, so concurrent clicks
     * for the same visitor never race into a duplicate-key check-then-insert.
     * - first_seen_* are written via $setOnInsert (only on the very first insert).
     * - last_seen_at + partner_id are always written ($set). Attribution is
     *   last-click: a newer click from an active partner overwrites partner_id.
     */
    async upsertFromClick(input: UpsertVisitorInput) {
        const now = input.now ?? new Date().toISOString();
        const _id = this.resolveVisitorId(input.visitorId);

        try {
            return await db.visitor
                .findOneAndUpdate(
                    { _id, programId: input.programId },
                    {
                        $setOnInsert: {
                            name: null,
                            firstSeenAt: now,
                            firstSeenPageUrl: input.pageUrl ?? null,
                            firstSeenClickId: input.clickId ?? null,
                            latitude: input.latitude ?? null,
                            longitude: input.longitude ?? null,
                            isFlagged: false,
                            status: VISITOR_STATUS.ACTIVE,
                        },
                        $set: {
                            partnerId: input.partnerId,
                            cookieDuration: input.cookieDuration ?? null,
                            countryCode: input.countryCode ?? null,
                            deviceManufacturer: input.deviceManufacturer ?? null,
                            deviceModel: input.deviceModel ?? null,
                            deviceOs: input.deviceOs ?? null,
                            deviceOsVersion: input.deviceOsVersion ?? null,
                            lastSeenAt: now,
                        },
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                )
                .lean();
        } catch (err) {
            // The provided id exists but belongs to a different program (ids are
            // globally unique) — retry once with a fresh id instead of failing the click.
            if ((err as { code?: number } | null)?.code === 11000) {
                return db.visitor
                    .findOneAndUpdate(
                        { _id: generateId(ID_PREFIX.visitor), programId: input.programId },
                        {
                            $setOnInsert: {
                                name: null,
                                firstSeenAt: now,
                                firstSeenPageUrl: input.pageUrl ?? null,
                                firstSeenClickId: input.clickId ?? null,
                                latitude: input.latitude ?? null,
                                longitude: input.longitude ?? null,
                                isFlagged: false,
                                status: VISITOR_STATUS.ACTIVE,
                            },
                            $set: {
                                partnerId: input.partnerId,
                                cookieDuration: input.cookieDuration ?? null,
                                countryCode: input.countryCode ?? null,
                                deviceManufacturer: input.deviceManufacturer ?? null,
                                deviceModel: input.deviceModel ?? null,
                                deviceOs: input.deviceOs ?? null,
                                deviceOsVersion: input.deviceOsVersion ?? null,
                                lastSeenAt: now,
                            },
                        },
                        { upsert: true, new: true, setDefaultsOnInsert: true },
                    )
                    .lean();
            }
            throw err;
        }
    }

    /** total_visitors for a single partner (partner details endpoint). */
    async getStatsByPartner(programId: string, partnerId: string) {
        const total_visitors = await db.visitor.countDocuments({ programId, partnerId });
        return { total_visitors };
    }

    /** total_visitors for many partners in one grouped aggregation (list endpoint, no N+1). */
    async getCountsByPartnerIds(programId: string, partnerIds: string[]): Promise<Map<string, number>> {
        if (!programId || partnerIds.length === 0) return new Map();

        const rows = await db.visitor
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

export const visitorService = new VisitorService();
