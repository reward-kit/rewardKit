const DECIMALS = 2 // 100 minor units per major unit

/** "12.34" -> 1234. Parses the string directly, so there are no float errors (12.34 * 100 = 1233.9999...). */
export const toMinorUnits = (input: string): number | null => {
    const v = input.trim()
    if (v === "") return null
    if (!new RegExp(`^\\d+(\\.\\d{1,${DECIMALS}})?$`).test(v)) return null
    const [whole, frac = ""] = v.split(".")
    return Number(whole) * 10 ** DECIMALS + Number(frac.padEnd(DECIMALS, "0"))
}

/** 1234 -> "12.34" (for filling form fields) */
export const fromMinorUnits = (minor: number | null | undefined): string => {
    if (minor == null) return ""
    return (minor / 10 ** DECIMALS).toFixed(DECIMALS)
}

/** 1234 -> "$12.34" (for display) */
export const formatMoney = (minor: number, currency = "USD", locale = "en-US") =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 10 ** DECIMALS)