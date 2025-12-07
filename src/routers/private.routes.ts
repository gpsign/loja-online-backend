import { Router } from "express";
import { authenticateToken } from "middlewares";
import { CartRouter } from "./cart.routes";
import { OrderRouter } from "./order.routes";
import { ProductRouter } from "./product.routes";

const PrivateRouter = Router();

PrivateRouter.use(authenticateToken)
  .use(ProductRouter)
  .use(CartRouter)
  .use(OrderRouter);

export { PrivateRouter };
