// partner.search-params.ts
import {
    createLoader,
    createSerializer,
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
} from "nuqs/server"

// only stored fields: sorting by computed stats (revenue etc.) needs an aggregation
export const PARTNER_SORT_FIELDS = ["createdAt", "firstName", "lastName", "email"] as const
export const PARTNER_TABS = ["active", "pending", "invited", "suspended"] as const
export type PartnerTableStatus = (typeof PARTNER_TABS)[number]

export const partnerTabParser = parseAsStringLiteral(PARTNER_TABS).withDefault("active")

export const partnerTableParsers = {
    search: parseAsString.withDefault(""),
    groupId: parseAsString,
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    sortBy: parseAsStringLiteral(PARTNER_SORT_FIELDS).withDefault("createdAt"),
    desc: parseAsBoolean.withDefault(true),
}

const PREFIX: Record<PartnerTableStatus, string> = {
    active: "partner_a",
    pending: "partner_p",
    invited: "partner_i",
    suspended: "partner_s",
}

type ParserKey = keyof typeof partnerTableParsers

// partner_a_search, partner_a_groupId, partner_a_page, ...
export const PARTNER_URL_KEYS = Object.fromEntries(
    (Object.keys(PREFIX) as PartnerTableStatus[]).map((s) => [
        s,
        Object.fromEntries(
            (Object.keys(partnerTableParsers) as ParserKey[]).map((k) => [k, `${PREFIX[s]}_${k}`]),
        ),
    ]),
) as Record<PartnerTableStatus, Record<ParserKey, string>>

export const serializePartnerTable = (
    status: PartnerTableStatus,
    base: string,
    values: Partial<{ [K in ParserKey]: unknown }>,
) =>
    createSerializer(partnerTableParsers, { urlKeys: PARTNER_URL_KEYS[status] })(base, values as never)

// server components / middleware
export const loadPartnerTableParams = (status: PartnerTableStatus) =>
    createLoader(partnerTableParsers, { urlKeys: PARTNER_URL_KEYS[status] })

export function partnersHref(tab: PartnerTableStatus = "active") {
    const keys = PARTNER_URL_KEYS[tab]
    const qs = new URLSearchParams({
        tab,
        [keys.search]: "",
        [keys.page]: "1",
        [keys.pageSize]: "10",
        [keys.sortBy]: "createdAt",
        [keys.desc]: "true",
    })
    return `/w/partners?${qs}`
}