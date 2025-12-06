import { AppError } from "./app.error";

export class InvalidCredentialsError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(message, 401, "invalid_credentials");
  }
}
