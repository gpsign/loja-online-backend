import { Prisma } from "@prisma/client";
import { prisma } from "prisma";
import { CreateProductParams } from "types";

export class ProductRepository {
  static async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: {
        images: true,
        config: true,
      },
    });
  }
}
