export declare class ApiError extends Error {
    statusCode: number;
    errors?: unknown;
    constructor(statusCode: number, message: string, errors?: unknown);
}
export declare class BadRequestError extends ApiError {
    constructor(message?: string, errors?: unknown);
}
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
export declare class ForbiddenError extends ApiError {
    constructor(message?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string);
}
export declare class ConflictError extends ApiError {
    constructor(message?: string);
}
