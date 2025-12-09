import { FavoriteController, ProductController } from "@controllers";
import { Router } from "express";
import { validateBody, validateQuery } from "@middlewares";
import { FavoriteSchema, ProductSchema } from "@schemas";

const ProductRouter = Router();

ProductRouter.post(
  "/products",
  validateBody(ProductSchema.Create),
  ProductController.createProduct
)
  .post("/products/:id/favorites", FavoriteController.addToFavorites)
  .delete("/products/:id/favorites", FavoriteController.removeFromFavorites)
  .get("/favorites", FavoriteController.getUserFavorites)
  .get(
    "/products/favorites",
    validateQuery(FavoriteSchema.Query),
    FavoriteController.getUsersWhoFavorited
  )
  .get(
    "/products",
    validateQuery(ProductSchema.Query),
    ProductController.getProducts
  )
  .get("/products/:id", ProductController.getProduct)
  .put(
    "/products/:id",
    validateBody(ProductSchema.Product),
    ProductController.updateProduct
  );

export { ProductRouter };
