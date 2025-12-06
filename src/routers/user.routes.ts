import { UserControler } from "controllers";
import { Router } from "express";
import { validateBody } from "middlewares";
import { UserSchema } from "schemas";

const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  validateBody(UserSchema.Registration),
  UserControler.signUser
);

export { UserRouter };
