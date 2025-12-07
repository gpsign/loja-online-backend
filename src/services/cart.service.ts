import { CartRepository } from "repositories";
import { CartUserProduct } from "types";
import { ProductService } from "./product.service";
import { UserService } from "./user.service";
import { User } from "@prisma/client";

export class CartService {
  static async addToUserCart({ userId, productId, quantity }: CartUserProduct) {
    await UserService.findOrFail("id", userId);
    await ProductService.findOrFail("id", productId);
    quantity ??= 1;

    const added = await CartRepository.createItem({
      userId,
      productId,
      quantity,
    });

    return added;
  }

  static async removeFromUserCart({ userId, productId }: CartUserProduct) {
    await UserService.findOrFail("id", userId);
    await ProductService.findOrFail("id", productId);

    await CartRepository.deleteItem({
      userId,
      productId,
    });
  }

  static async updateProductQuantity({
    userId,
    productId,
    quantity,
  }: CartUserProduct) {
    await UserService.findOrFail("id", userId);
    await ProductService.findOrFail("id", productId);
    quantity ??= 1;

    await CartRepository.updateItemQuantity({
      userId,
      productId,
      quantity,
    });
  }

  static async getCartItems(userId: User["id"]) {
    await UserService.findOrFail("id", userId);

    return (await CartRepository.getUserCart(userId)).items;
  }
}
