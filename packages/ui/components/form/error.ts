export const getErrorMessage = (errors: unknown[]) =>
    errors
        .map((e) => (typeof e === "string" ? e : (e as { message?: string })?.message))
        .filter(Boolean)
        .join(", ")