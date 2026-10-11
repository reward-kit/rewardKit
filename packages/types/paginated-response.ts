import z from "zod"
import type { Model, PopulateOptions } from "mongoose";

export type PaginateOptions<T> = {
    model: Model<T>;
    query: Record<string, unknown>;
    extraMatch?: Record<string, unknown>;
    page: number;
    limit: number;
    select?: string;
    populate?: string | PopulateOptions | Array<string | PopulateOptions>;
    sort?: Record<string, 1 | -1>;
};


export const ZPaginatedResponse = <T extends z.ZodType>(item: T) =>
    z.object({
        data: z.array(item),
        page: z.number().int().min(1),
        limit: z.number().int().min(1),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNextPage: z.boolean(),
        hasPrevPage: z.boolean(),
    })

// same shape as your PaginatedResponse<T>, derived from the schema
export type PaginatedResponse<T extends z.ZodType> = z.infer<ReturnType<typeof ZPaginatedResponse<T>>>

// pagination fields shared by every paginated response (no data dependency)
export type PaginationMeta = Pick<PaginatedResponse<z.ZodType>, "page" | "limit" | "total" | "totalPages" | "hasNextPage" | "hasPrevPage">