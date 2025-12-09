import { AuthController } from "@controllers";"middlewares"
import { Router } from "express";
import { validateBody } from "@middlewares";
import { AuthSchema } from "@schemas";

const AuthRouter = Router();

AuthRouter.post(
  "/sign-in",
  validateBody(AuthSchema.SignIn),
  AuthController.signIn
);

export { AuthRouter };
