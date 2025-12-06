import { AppError } from "errors";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      issues: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message,
    });
  }

  console.error("CRITICAL ERROR", err);

  return res.status(500).json({
    status: "error",
    code: "internal_server_error",
    message: "Internal server error",
  });
};
