import { UserControler } from "controllers";
import { Router } from "express";
import { authenticateToken, validateBody, validateParams } from "middlewares";
import { UserSchema } from "schemas";

const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  validateBody(UserSchema.Registration),
  UserControler.signUser
)
  .use(authenticateToken)
  .get(
    "/user/:id/products",
    validateParams(UserSchema.GetProducts),
    UserControler.getUserProducts
  )
  .patch(
    "/user/:id/status",
    validateBody(UserSchema.PatchStatus),
    validateParams(UserSchema.GetProducts),
    UserControler.updateStatus
  );

export { UserRouter };
