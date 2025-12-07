import { Prisma, Product, User } from "@prisma/client";
import { prisma } from "prisma";
import { CreateFavoriteParams } from "types";

export class FavoriteRepository {
  static async create(data: Prisma.FavoriteCreateInput) {
    return prisma.favorite.create({ data });
  }

  static async find({ userId, productId }: CreateFavoriteParams) {
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

  static async findManyByUser(userId: User["id"]) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
  }

  static async delete({ userId, productId }: CreateFavoriteParams) {
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

  static async productFavoriteCount(productId: Product["id"]) {
    return prisma.favorite.count({
      where: {
        productId,
      },
    });
  }

  static async findManyByProduct(productId: Product["id"]) {
    return prisma.favorite.findMany({
      where: {
        productId,
      },
    });
  }
}
