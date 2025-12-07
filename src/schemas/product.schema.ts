import z from "zod";
import { AppSchema } from "./app.schema";

export class ProductSchema {
  static Image = z.object({
    imageUrl: z.url(),
    isCover: z.boolean().optional(),
    displayOrder: z.number().optional(),
  });

  static Create = z.object({
    name: z.string().min(3),
    price: z.number().min(0),
    description: z.string().min(3).optional(),
    categoryId: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).optional(),
    isStockInfinite: z.boolean().optional(),
    status: z.boolean().optional(),
    images: z.array(ProductSchema.Image).optional(),
  });

  static Query = z.object({
    page: AppSchema.SignedInteger.optional(),
    size: AppSchema.SignedInteger.optional(),
    search: z.string().optional(),
    minPrice: AppSchema.SignedInteger.optional(),
    maxPrice: AppSchema.SignedInteger.optional(),
    orderBy: z.enum(["price", "createdAt", "name"]).optional(),
    orderType: z.enum(["asc", "desc"]).optional(),
  });
}
