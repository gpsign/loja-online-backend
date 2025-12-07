import { ProductController } from "controllers/product.controller";
import { Router } from "express";
import { validateBody } from "middlewares";
import { ProductSchema } from "schemas";

const ProductRouter = Router();

ProductRouter.post(
  "/product",
  validateBody(ProductSchema.Create),
  ProductController.createProduct
);

export { ProductRouter };
