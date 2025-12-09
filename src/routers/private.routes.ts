import { Router } from "express";
import { authenticateToken } from "@middlewares";
import { CartRouter } from "./cart.routes.js";
import { OrderRouter } from "./order.routes.js";
import { ProductRouter } from "./product.routes.js";
import { DashboardRouter } from "./dashboard.routes.js";

const PrivateRouter = Router();

PrivateRouter.use(authenticateToken)
  .use(ProductRouter)
  .use(CartRouter)
  .use(OrderRouter)
  .use(DashboardRouter);

export { PrivateRouter };
