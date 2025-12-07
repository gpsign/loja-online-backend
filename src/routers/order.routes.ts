import { OrderController } from "controllers";
import { Router } from "express";

const OrderRouter = Router();

OrderRouter.post("/orders", OrderController.postOrder);

export { OrderRouter };
