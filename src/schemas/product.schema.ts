import z from "zod";

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
}
