export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'APP_ERROR',
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class RepositoryError extends AppError {
  constructor(message: string) {
    super(message, 'REPOSITORY_ERROR', 500);
    this.name = 'RepositoryError';
  }
}

export class ServiceError extends AppError {
  constructor(message: string, code: string = 'SERVICE_ERROR', statusCode: number = 500) {
    super(message, code, statusCode);
    this.name = 'ServiceError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
