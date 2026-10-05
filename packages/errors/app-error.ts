export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message)
        this.name = this.constructor.name
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND")
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400, "BAD_REQUEST")
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409, "CONFLICT")
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, "INTERNAL_SERVER_ERROR")
    }
}