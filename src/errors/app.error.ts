export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly action: string | undefined;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 400,
    code: string = "app_error",
    action?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.action = action;

    Error.captureStackTrace(this, this.constructor);
  }
}
