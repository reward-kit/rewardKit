import { ProgramResource } from "./program.schema"
import { BaseAPIResponse } from "../api/base.api.schema"

export type CreateProgramRequest = {
    orgId: string
    userId: string
    programData: ProgramResource
}
export type CreateProgramResponse = BaseAPIResponse & {
    program: ProgramResource
}

export type GetProgramRequest = {
    programId: string
}
export type GetProgramResponse = BaseAPIResponse & {
    program: ProgramResource
}

export type UpdateProgramRequest = {
    programId: string
    programData: Partial<ProgramResource>
}
export type UpdateProgramResponse = BaseAPIResponse & {
    program: ProgramResource
}