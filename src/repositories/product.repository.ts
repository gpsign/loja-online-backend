import { Prisma, Product } from "@prisma/client";
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

  static async findByKey<K extends keyof Product>(
    key: K,
    value: NonNullable<Prisma.ProductWhereUniqueInput[K]>,
    select: Prisma.ProductSelect | null = null
  ) {
    const where = { [key]: value } as unknown as Prisma.ProductWhereUniqueInput;

    return prisma.product.findUnique({
      where,
      select,
    });
  }
}
