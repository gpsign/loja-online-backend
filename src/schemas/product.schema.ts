import z from "zod";
import { AppSchema } from "./app.schema";

export class ProductSchema {
  static Image = z.object({
    imageUrl: z.url(),
    isCover: z.boolean().optional(),
    displayOrder: z.number().optional(),
  });

  static Config = z.object({
    isStockInfinite: z.boolean().optional(),
    showStockWarning: z.boolean().optional(),
  });

  static Create = z.object({
    name: z.string().min(3),
    price: z.number().min(0),
    description: z.string().min(3).optional(),
    categoryId: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).optional(),
    status: z.boolean().optional(),
    images: z.array(ProductSchema.Image).optional(),
    config: ProductSchema.Config.optional(),
  });

  static Query = z.object({
    page: z.coerce.number().optional(),
    size: z.coerce.number().optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: AppSchema.SignedInteger.optional(),
    orderBy: z.enum(["price", "createdAt", "name"]).optional(),
    orderType: z.enum(["asc", "desc"]).optional(),
  });
}
