export const keys = {
    program: { getCurrentProgram: () => "/api/v1/program", updateProgram: (programId: string | undefined) => `/api/v1/program/${programId}` },
};