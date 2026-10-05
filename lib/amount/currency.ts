import { getAllISOCodes } from "iso-country-currency";

const flagImageUrl = (iso: string): string => `/images/country-flags/${iso.toLowerCase()}.png`

interface ISOEntry {
    iso: string;
    countryName: string;
    currency: string;
    symbol: string;
}

export interface CurrencyOptions {
    value: string;
    label: string;
    src?: string;
}

function getPreferredISO(currency: string, entries: ISOEntry[]): string {
    const OVERRIDES: Record<string, string> = {
        EUR: "EU",
        XOF: "SN",
        XAF: "CM",
        XCD: "AG",
        XPF: "PF",
    };

    if (OVERRIDES[currency]) return OVERRIDES[currency];

    const prefix = currency.slice(0, 2);
    const match = entries.find((e) => e.iso === prefix);
    // fallback to first entry - entries is always non-empty here
    return match?.iso ?? entries[0]?.iso ?? currency.slice(0, 2);
}

const getCurrencyName = (currencyCode: string): string => {
    try {
        return (
            new Intl.DisplayNames(["en"], { type: "currency" }).of(currencyCode) ??
            currencyCode
        );
    } catch {
        return currencyCode;
    }
};

export function buildCurrencyOptions(): CurrencyOptions[] {
    const entries = getAllISOCodes() as ISOEntry[];

    // Deduplicate by currency
    const currencyMap = new Map<string, ISOEntry[]>();
    for (const entry of entries) {
        if (!entry.currency) continue;
        if (!currencyMap.has(entry.currency)) currencyMap.set(entry.currency, []);
        currencyMap.get(entry.currency)!.push(entry);
    }

    return Array.from(currencyMap.entries())
        .map<CurrencyOptions>(([currency, currencyEntries]) => {
            const iso = getPreferredISO(currency, currencyEntries);

            return {
                value: currency,
                // Format output as "INR - Indian Rupee"
                label: currency,
                imageUrl: flagImageUrl(iso),
            };
        })
        .sort((a, b) => a.value.localeCompare(b.value));
}