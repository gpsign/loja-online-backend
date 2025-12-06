import { Router } from "express";
import { ProductRouter } from "./product.routes";
import { authenticateToken } from "middlewares";

const PrivateRouter = Router();

PrivateRouter.use(authenticateToken).use(ProductRouter);

export { PrivateRouter };
