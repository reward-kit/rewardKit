export const toSubdomain = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 63)
        .replace(/-+$/g, "")

export const validateSubdomain = (value: string) => {
    if (!value) return "Enter a subdomain"
    if (value.length > 63) return "Use 63 characters or fewer"
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase letters, numbers, and single hyphens between words"
    }

    return null
}