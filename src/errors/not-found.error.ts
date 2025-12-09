import { AppError } from "./app.error.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, 404, "Not_found");
  }
}
