export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request", errors?: unknown) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}
