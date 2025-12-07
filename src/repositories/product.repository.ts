import { Prisma, Product } from "@prisma/client";
import { prisma } from "prisma";
import { ProductQueryConfig, ProductQueryResult } from "types";
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

  async findAll(
    params: ProductQueryConfig
  ): Promise<ProductQueryResult<Product>> {
    const {
      page = 1,
      size = 10,
      search,
      minPrice,
      maxPrice,
      orderBy = "createdAt",
      orderType = "desc",
    } = params;

    const where: Prisma.ProductWhereInput = {
      status: "active",
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          [orderBy]: orderType,
        },
        include: {
          images: {
            where: { isCover: true },
            take: 1,
          },
          seller: {
            select: { name: true },
          },
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }
}

const ProductRepository = new ProductRepositoryClass();

export { ProductRepository };
