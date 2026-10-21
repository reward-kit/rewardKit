import { db } from "@rewardkit/packages/db/db";
import { AppError, NotFoundError } from "@rewardkit/packages/errors/app-error";
import { PARTNER_STATUS } from "@rewardkit/packages/types/partner/partner.schema";
import { PROGRAM_STATUS } from "@rewardkit/packages/types/program/program.schema";
import type { TrackClickRequest, TrackClickResponse } from "@rewardkit/packages/types/click/click.api.schema";
import { visitorService } from "./visitor.service";
import { clickService } from "./click.service";
import {
    extractIp,
    getCountryFromHeaders,
    isAllowedOrigin,
    isBotUserAgent,
    isRateLimited,
    parseUserAgent,
} from "../utils/tracking.utils";

export type TrackClickResult = {
    response: TrackClickResponse;
    /** The validated origin, so the route can echo it in Access-Control-Allow-Origin. */
    allowedOrigin: string | null;
};

export class TrackingService {
    /**
     * Full tracking pipeline. Cheap rejections first (bot, rate limit), then
     * program → link → partner resolution, origin validation against the
     * program website and the partner group's website, and finally the two
     * writes (visitor upsert, click insert).
     *
     * Every "nothing to track" path returns `{ tracked: false }` with no
     * details, so an outside caller can't distinguish a missing link from an
     * inactive partner. Origin mismatches are the one hard rejection (403),
     * checked before each distinguishable exit so a disallowed origin can't
     * probe link codes by comparing 403 vs 200.
     */
    async trackClick(req: Request, body: TrackClickRequest): Promise<TrackClickResult> {
        const originHeader = req.headers.get("origin");
        const refererHeader = req.headers.get("referer");
        const requestOrigin = originHeader ?? refererOrigin(refererHeader);

        // Cheap rejections before touching the database. No CORS on these —
        // the script ignores tracked:false either way.
        if (isBotUserAgent(req.headers.get("user-agent"))) return { response: { tracked: false }, allowedOrigin: null };
        if (isRateLimited(extractIp(req))) return { response: { tracked: false }, allowedOrigin: null };

        // Program must exist and be active (checked before origin, per pipeline order).
        const program = await db.program.findById(body.program_id).lean();
        if (!program) throw new NotFoundError("Program not found");
        if (program.status !== PROGRAM_STATUS.ACTIVE) {
            return { response: { tracked: false }, allowedOrigin: null };
        }

        const link = await db.link
            .findOne({ programId: body.program_id, code: body.code.toLowerCase() })
            .lean();

        if (!link) {
            // With no link there is no partner and no group, so the only origin
            // we can allow is the program's own website.
            const allowedOrigin = originIfAllowed(requestOrigin, [program.websiteUrl]);
            return { response: { tracked: false }, allowedOrigin };
        }

        const partner = await db.partner.findById(link.partnerId).lean();
        const group = partner?.groupId ? await db.partnerGroup.findById(partner.groupId).lean() : null;

        // Full origin validation: program website, plus the partner group's
        // website when the partner belongs to a group.
        const allowedOrigin = originIfAllowed(requestOrigin, [program.websiteUrl, group?.websiteUrl]);
        if (requestOrigin && !allowedOrigin) throw originForbidden();

        if (!partner || partner.status !== PARTNER_STATUS.ACTIVE || partner.orgId !== program.orgId) {
            return { response: { tracked: false }, allowedOrigin };
        }

        const device = parseUserAgent(req.headers.get("user-agent"));
        const visitor = await visitorService.upsertFromClick({
            programId: body.program_id,
            partnerId: partner._id,
            cookieDuration: program.cookieDuration,
            countryCode: getCountryFromHeaders(req),
            deviceManufacturer: device.deviceManufacturer,
            deviceModel: device.deviceModel,
            deviceOs: device.deviceOs,
            deviceOsVersion: device.deviceOsVersion,
            pageUrl: body.page,
            visitorId: body.visitor_id,
        });
        const visitorId = String(visitor?._id);

        const click = await clickService.createClick({
            programId: body.program_id,
            partnerId: partner._id,
            linkId: link._id,
            visitorId,
            code: link.code,
            page: body.page,
            param: body.param ?? link.urlParam,
            referrer: body.referrer,
        });
        const clickId = String(click?._id);

        // Record the first click only while unset — conditional write, no read.
        await db.visitor.updateOne(
            { _id: visitorId, firstSeenClickId: null },
            { $set: { firstSeenClickId: clickId } },
        );

        return {
            response: {
                tracked: true,
                visitor_id: visitorId,
                click_id: clickId,
                cookie_duration: program.cookieDuration ?? 30,
            },
            allowedOrigin,
        };
    }
}

/** The echoed origin when allowed (or absent — nothing to validate), null on mismatch. */
function originIfAllowed(origin: string | null, allowedUrls: Array<string | null | undefined>): string | null {
    if (!origin) return null;
    return isAllowedOrigin(origin, allowedUrls) ? origin : null;
}

function originForbidden(): AppError {
    return new AppError("Origin not allowed", 403, "FORBIDDEN");
}

/** Origin (scheme + host) of a Referer header, since some requests only send Referer. */
function refererOrigin(referer: string | null): string | null {
    if (!referer) return null;
    try {
        return new URL(referer).origin;
    } catch {
        return null;
    }
}

export const trackingService = new TrackingService();
