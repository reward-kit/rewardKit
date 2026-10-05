type DecimalSeparator = "." | ",";
type ThousandSeparator = "." | "," | " " | "'" | "";

export function formatMinorAmount(
  amountMinor?: number | null,
  options?: {
    decimalSeparator?: DecimalSeparator;
    thousandSeparator?: ThousandSeparator;
  }
): string {
  const {
    decimalSeparator = ".",
    thousandSeparator = ",",
  } = options ?? {};

  if(!amountMinor) return "0"
  const value = amountMinor / 100;
  const hasDecimals = !Number.isInteger(value);

  const formatted = value.toFixed(hasDecimals ? 2 : 0);

  // ✅ DEFAULT VALUE FIX (this is the key)
  const [rawIntPart = "", decPart] = formatted.split(".");

  let intPart = rawIntPart;

  if (thousandSeparator) {
    intPart = intPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator
    );
  }

  if (!hasDecimals || !decPart) {
    return intPart;
  }

  return `${intPart}${decimalSeparator}${decPart}`;
}

export function parseToMinorAmount(
  formatted: string,
  options?: {
    decimalSeparator?: "." | ",";
    thousandSeparator?: "." | "," | " " | "'" | "";
  }
): number {
  const { decimalSeparator = ".", thousandSeparator = "," } = options ?? {};

  let cleaned = formatted.trim();

  // Strip thousand separators first (only if defined)
  if (thousandSeparator) {
    // Escape special regex chars (. needs escaping)
    const escapedThousand = thousandSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(escapedThousand, "g"), "");
  }

  // Normalize decimal separator to "." for parseFloat
  if (decimalSeparator !== ".") {
    cleaned = cleaned.replace(decimalSeparator, ".");
  }

  const float = parseFloat(cleaned);

  if (isNaN(float)) return 0;

  // Convert back to minor units (cents)
  return Math.round(float * 100);
}