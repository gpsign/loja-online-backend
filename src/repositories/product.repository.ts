import { Prisma, Product } from "@prisma/client";
import { prisma } from "prisma";
import { AppRepository } from "./app.repository";

class ProductRepositoryClass extends AppRepository<"product"> {
  constructor() {
    super(prisma.product);
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: {
        images: true,
        config: true,
      },
    });
  }
}

const ProductRepository = new ProductRepositoryClass();

export { ProductRepository };
