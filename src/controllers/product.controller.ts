import { Request, Response } from "express";
import { ProductService } from "services";
import { AuthRequest, MassCreateProductParams } from "types";

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
    const userId = (req as AuthRequest).userId;
    const product = await ProductService.findOrFail(
      "id",
      Number(req.params.id),
      {
        include: {
          images: true,
          config: true,
          favoritedBy: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
        },
      }
    );
    return res.status(201).json(product);
  }

  static async getProducts(req: Request, res: Response) {
    const products = await ProductService.listProducts({
      ...req.query,
      userId: (req as AuthRequest).userId,
    });
    return res.status(201).json(products);
  }

  static async updateProduct(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const userId = (req as AuthRequest).userId;

    const updatedProduct = await ProductService.updateProduct(
      productId,
      userId,
      req.body
    );

    return res.status(200).json(updatedProduct);
  }
}
