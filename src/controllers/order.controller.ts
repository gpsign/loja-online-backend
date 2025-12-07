import { Request, Response } from "express";
import { OrderService } from "services";
import { AuthRequest } from "types";

export class OrderController {
  static async postOrder(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    const order = await OrderService.orderCart(userId);

    res.status(201).send(order);
  }
}
