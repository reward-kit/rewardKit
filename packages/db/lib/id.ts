// packages/server/lib/id.ts
import { customAlphabet } from "nanoid"

const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 26)

export const ID_PREFIX = {
    program: "prg",
    affiliate: "aff",
    commission: "com",
    payout: "pay",
    group: "grp",
    apiKey: "sk",
} as const

export type IdPrefix = (typeof ID_PREFIX)[keyof typeof ID_PREFIX]

export const generateId = (prefix: IdPrefix) => `${prefix}_${nano()}`

// reusable _id definition for every schema
export const idField = (prefix: IdPrefix) => ({
    type: String,
    default: () => generateId(prefix),
})

export const transform = (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id
    return ret
}