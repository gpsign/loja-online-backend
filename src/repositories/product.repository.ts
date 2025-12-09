import { Prisma, Product, User } from "@prisma/client";
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

  async findManyByUser(userId: User["id"]) {
    return prisma.product.findMany({
      where: { sellerId: userId },
      include: { images: { where: { isCover: true }, take: 1 }, config: true },
    });
  }

  async findAll(
    params: ProductQueryConfig & { userId: User["id"] }
  ): Promise<ProductQueryResult<Product>> {
    const {
      userId,
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
        take: Number(size),
        skip: (page - 1) * size,
        orderBy: {
          [orderBy]: orderType,
        },
        include: {
          config: true,
          images: {
            where: { isCover: true },
            take: 1,
          },
          favoritedBy: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
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
