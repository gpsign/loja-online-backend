import { Product } from "@prisma/client";
import { Request, Response } from "express";
import { ProductService } from "services";
import {
  AuthRequest,
  CreateProductParams,
  MassCreateProductParams,
} from "types";

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const data = req.body as MassCreateProductParams;

    const products = [];

    if ("products" in data) products.push(...data.products);
    else products.push(data);

    const promises = [];

    for (const product of products) {
      product.sellerId = (req as AuthRequest).userId;
      promises.push(ProductService.createProduct(product));
    }

    const created = await Promise.all(promises);

    return res.status(201).json(created);
  }

  static async getProduct(req: Request, res: Response) {
    const product = await ProductService.findOrFail(
      "id",
      Number(req.params.id),
      { include: { images: true, config: true } }
    );
    return res.status(201).json(product);
  }

  static async getProducts(req: Request, res: Response) {
    const products = await ProductService.listProducts(req.query);
    return res.status(201).json(products);
  }
}
