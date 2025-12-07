import { FavoriteController } from "controllers";
import { ProductController } from "controllers/product.controller";
import { Router } from "express";
import { validateBody, validateQuery } from "middlewares";
import { FavoriteSchema, ProductSchema } from "schemas";

const ProductRouter = Router();

ProductRouter.post(
  "/products",
  validateBody(ProductSchema.Create),
  ProductController.createProduct
)
  .post("/products/:id/favorites", FavoriteController.addToFavorites)
  .delete("/products/:id/favorites", FavoriteController.removeFromFavorites)
  .get("/products/:id/favorites", FavoriteController.getUserFavorites)
  .get(
    "/products/favorites",
    validateQuery(FavoriteSchema.Query),
    FavoriteController.getUsersWhoFavorited
  );

export { ProductRouter };
