import { Request, Response } from "express";
import { CartService } from "@services";
import { AuthRequest } from "@types";

export class CartController {
  static async addToCart(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity ?? 1;
    const product = await CartService.addToUserCart({
      userId,
      productId,
      quantity,
    });

    res.status(201).send(product);
  }

  static async removeFromCart(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;
    const productId = req.body.productId;

    await CartService.removeFromUserCart({
      userId,
      productId,
    });

    res.status(200).send({ productId });
  }

  static async updateQuantity(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    await CartService.updateProductQuantity({
      userId,
      productId,
      quantity,
    });

    res.status(200).send({ quantity });
  }

  static async listCartItems(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    const items = await CartService.getCartItems(userId);

    res.status(200).send(items);
  }
}
