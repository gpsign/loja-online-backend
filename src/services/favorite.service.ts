import { Product, User } from "@prisma/client";
import { FavoriteRepository } from "repositories";
import { CreateFavoriteParams } from "types";
import { ProductService } from "./product.service";
import { UserService } from "./user.service";

export class FavoriteService {
  static async addToFavorite({ productId, userId }: CreateFavoriteParams) {
    const product = await ProductService.findOrFail("id", productId);
    await UserService.findOrFail("id", userId);

    const duplicate = await FavoriteRepository.findByKey(
      "userId_productId",
      {
        userId,
        productId,
      },
      { include: { product: true } }
    );

    if (duplicate) {
      return duplicate;
    }

    const favorite = await FavoriteRepository.create(
      {
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
      { include: { product: true } }
    );

    return favorite;
  }

  static async removeFromFavorite({ productId, userId }: CreateFavoriteParams) {
    await ProductService.findOrFail("id", productId);
    await UserService.findOrFail("id", userId);

    const deleted = await FavoriteRepository.delete({
      productId,
      userId,
    });

    return deleted;
  }

  static async listUserFavorites(userId: User["id"]) {
    await UserService.findOrFail("id", userId);

    const favorites = await FavoriteRepository.findManyByUser(userId);

    return favorites;
  }

  static async getProductFavoriteCount(productId: Product["id"]) {
    await ProductService.findOrFail("id", productId);

    const count = await FavoriteRepository.productFavoriteCount(productId);

    return count;
  }

  static async getProductFavorite(productId: Product["id"], count = false) {
    await ProductService.findOrFail("id", productId);

    if (count) {
      return await FavoriteRepository.productFavoriteCount(productId);
    }

    return await FavoriteRepository.findManyByProduct(productId);
  }
}
