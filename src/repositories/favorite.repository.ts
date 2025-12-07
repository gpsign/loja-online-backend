import { Product, User } from "@prisma/client";
import { prisma } from "prisma";
import { CreateFavoriteParams } from "types";
import { AppRepository } from "./app.repository";

class FavoriteRepositoryClass extends AppRepository<"favorite"> {
  constructor() {
    super(prisma.favorite);
  }

  async find({ userId, productId }: CreateFavoriteParams) {
    return prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async findManyByUser(userId: User["id"]) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
  }

  async delete({ userId, productId }: CreateFavoriteParams) {
    return prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async productFavoriteCount(productId: Product["id"]) {
    return prisma.favorite.count({
      where: {
        productId,
      },
    });
  }

  async findManyByProduct(productId: Product["id"]) {
    return prisma.favorite.findMany({
      where: {
        productId,
      },
    });
  }
}

const FavoriteRepository = new FavoriteRepositoryClass();

export { FavoriteRepository };
