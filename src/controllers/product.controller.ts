import { Request, Response } from "express";
import { ProductService } from "services";
import { AuthRequest, CreateProductParams } from "types";

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const data = req.body as CreateProductParams;
    data.sellerId = (req as AuthRequest).userId;
    const product = await ProductService.createProduct(data);

    return res.status(201).json(product);
  }
}
