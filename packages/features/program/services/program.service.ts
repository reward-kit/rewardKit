import { db } from "@rewardkit/packages/db/db";
import { NotFoundError } from "@rewardkit/packages/errors/app-error";
import { CreateProgramRequest, CreateProgramResponse, GetProgramByOrgIdRequest, GetProgramByOrgIdResponse, GetProgramRequest, GetProgramResponse, ListProgramsRequest, ListProgramsResponse, UpdateProgramRequest, UpdateProgramResponse } from "@rewardkit/packages/types/program/program.api.schema";

export class ProgramService {

    async createProgram(createProgramData: CreateProgramRequest): Promise<CreateProgramResponse> {
        const program = await db.program.create({
            orgId: createProgramData.orgId,
            userId: createProgramData.userId,
            ...createProgramData.programData
        });
        return { success: true, message: "Program created successfully", program };
    }

    async getProgram(getProgramData: GetProgramRequest): Promise<GetProgramResponse> {
        const program = await db.program.findById(getProgramData.programId);
        if (!program) {
            throw new NotFoundError("Program not found");
        }
        return { success: true, message: "Program retrieved successfully", program };
    }

    async getProgramByOrgId(getProgramData: GetProgramByOrgIdRequest): Promise<GetProgramByOrgIdResponse> {
        const program = await db.program.findOne({ orgId: getProgramData.orgId });
        if (!program) {
            throw new NotFoundError("Program not found");
        }
        return { success: true, message: "Program retrieved successfully", program };
    }

    async listPrograms(listProgramsData: ListProgramsRequest): Promise<ListProgramsResponse> {
        const programs = await db.program
            .find({ orgId: listProgramsData.orgId })
            .sort({ createdAt: 1 })

        return { success: true, message: "Programs retrieved successfully", programs };
    }

    async updateProgram(updateProgramData: UpdateProgramRequest): Promise<UpdateProgramResponse> {
        const updatedProgram = await db.program.findOneAndUpdate(
            { _id: updateProgramData.programId },
            { $set: updateProgramData.programData },
            { returnDocument: "after", runValidators: true }
        ).lean();

        if (!updatedProgram) {
            throw new Error("Program not found");
        }

        return { success: true, message: "Program updated successfully", program: updatedProgram };
    }

    async deleteProgram(programId: string): Promise<{ success: boolean; message?: string }> {
        const program = await db.program.findById(programId);
        if (!program) {
            throw new Error("Program not found");
        }
        await db.program.deleteOne({ _id: program.id });
        return { success: true, message: "Program deleted successfully" };
    }
}

export const programService = new ProgramService();