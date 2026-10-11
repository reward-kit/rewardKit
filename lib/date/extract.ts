export type DateInput = string | Date | number

export type DatePart =
    | "year"
    | "month"
    | "day"
    | "hours"
    | "minutes"
    | "seconds"
    | "dayOfWeek"
    | "monthName"
    | "quarter"
    | "weekOfYear"

type DatePartValueMap = {
    year: number
    month: number
    day: number
    hours: number
    minutes: number
    seconds: number
    dayOfWeek: number
    monthName: string
    quarter: number
    weekOfYear: number
}

export type ExtractedDateParts<T extends DatePart[]> = {
    [K in T[number]]: DatePartValueMap[K]
}

function resolveDate(input: DateInput): Date {
    let date: Date

    if (typeof input === "number") {
        date = new Date(input * 1000)
    } else if (typeof input === "string") {
        date = new Date(input)
    } else {
        date = input
    }

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date input: ${String(input)}`)
    }

    return date
}

function extractPart(date: Date, part: DatePart): DatePartValueMap[typeof part] {
    switch (part) {
        case "year":        return date.getFullYear()
        case "month":       return date.getMonth() + 1
        case "day":         return date.getDate()
        case "hours":       return date.getHours()
        case "minutes":     return date.getMinutes()
        case "seconds":     return date.getSeconds()
        case "dayOfWeek":   return date.getDay()
        case "monthName":   return date.toLocaleString("default", { month: "long" })
        case "quarter":     return Math.ceil((date.getMonth() + 1) / 3)
        case "weekOfYear": {
            const startOfYear = new Date(date.getFullYear(), 0, 1)
            const diff = date.getTime() - startOfYear.getTime()
            return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7)
        }
    }
}

export function extractDateParts<T extends DatePart[]>(
    input: DateInput,
    parts: T,
): ExtractedDateParts<T> {
    const date = resolveDate(input)

    return Object.fromEntries(
        parts.map((part) => [part, extractPart(date, part)])
    ) as ExtractedDateParts<T>
}