const COUNTRY_CODES = [
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ",
    "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ",
    "DE", "DJ", "DK", "DM", "DO", "DZ",
    "EC", "EE", "EG", "EH", "ER", "ES", "ET",
    "FI", "FJ", "FK", "FM", "FO", "FR",
    "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY",
    "HK", "HM", "HN", "HR", "HT", "HU",
    "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT",
    "JE", "JM", "JO", "JP",
    "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ",
    "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
    "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
    "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ",
    "OM",
    "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY",
    "QA",
    "RE", "RO", "RS", "RU", "RW",
    "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ",
    "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
    "UA", "UG", "UM", "US", "UY", "UZ",
    "VA", "VC", "VE", "VG", "VI", "VN", "VU",
    "WF", "WS",
    "YE", "YT",
    "ZA", "ZM", "ZW",
] as const

// fixed "en" locale so server and client render the same names (no hydration mismatch)
export type CountryCode = (typeof COUNTRY_CODES)[number]
export type CountryOption = { label: string; value: string; imageUrl?: string }

// fixed "en" locale so server and client render the same names (no hydration mismatch)
const regionNames = new Intl.DisplayNames(["en"], { type: "region" })

export const getCountryName = (code: string) => regionNames.of(code) ?? code
export const getCountryFlagUrl = (code: string) => `/images/country-flags/${code.toLowerCase()}.png`

// plain list: label + value only
export const ALL_COUNTRIES: CountryOption[] = COUNTRY_CODES
    .map((code) => ({ label: getCountryName(code), value: code }))
    .sort((a, b) => a.label.localeCompare(b.label))

// same list with a flag on every option
export const ALL_COUNTRIES_WITH_FLAGS: CountryOption[] = ALL_COUNTRIES
    .map((c) => ({ ...c, imageUrl: getCountryFlagUrl(c.value) }))

export type CountryInfo = { code: string; name: string; flagUrl: string }

// returns name + flag for a country code (case-insensitive, safe on bad input)
export const getCountry = (code: string): CountryInfo => {
    const upper = code.trim().toUpperCase()
    let name = upper
    try {
        name = regionNames.of(upper) ?? upper
    } catch {
        // Intl.DisplayNames throws RangeError on malformed codes, so fall back to the raw code
    }
    return { code: upper, name, flagUrl: getCountryFlagUrl(upper) }
}