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
    showStock: z.boolean().optional(),
  });

  static Product = z.object({
    name: z.string().min(3),
    price: z.number().min(0),
    description: z.string().min(3).optional(),
    categoryId: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    images: z.array(ProductSchema.Image).optional(),
    config: ProductSchema.Config.optional(),
  });

  static MultipleProducts = z.object({
    products: z.array(ProductSchema.Product),
  });

  static Create = z.custom<any>().superRefine((data, ctx) => {
    if (data && typeof data === "object" && "products" in data) {
      const result = ProductSchema.MultipleProducts.safeParse(data);
      if (result.success) return;
      result.error.issues.forEach((issue) => ctx.addIssue(issue as any));
      return;
    }

    const result = ProductSchema.Product.safeParse(data);

    if (result.success) return;
    result.error.issues.forEach((issue) => ctx.addIssue(issue as any));
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
