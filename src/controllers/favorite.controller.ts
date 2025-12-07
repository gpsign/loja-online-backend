import { Request, Response } from "express";
import { FavoriteService } from "services/favorite.service";
import { AuthRequest } from "types";

export class FavoriteController {
  static async addToFavorites(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const userId = (req as AuthRequest).userId;

    const product = await FavoriteService.addToFavorite({
      userId,
      productId,
    });

    res.status(201).send(product);
  }

  static async removeFromFavorites(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const userId = (req as AuthRequest).userId;

    const product = await FavoriteService.removeFromFavorite({
      userId,
      productId,
    });

    res.status(200).send(product);
  }

  static async getUserFavorites(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    const favorites = await FavoriteService.listUserFavorites(userId);

    res.status(200).send(favorites);
  }

  static async getUsersWhoFavorited(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;
    const count = Boolean(req.body?.count) || req.query?.count === "true";

    const favorites = await FavoriteService.getProductFavorite(userId, count);

    res.status(200).send(favorites);
  }
}
