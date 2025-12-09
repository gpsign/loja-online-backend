import { AppError } from "./app.error";

export class ForbiddenError extends AppError {
  constructor(message: string, code: string = "forbidden") {
    super(message, 403, code);
  }
}
