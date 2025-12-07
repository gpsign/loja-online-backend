import { User } from "@prisma/client";
import { ConflictError } from "errors";
import { CartRepository } from "repositories";
import { CartUserProduct } from "types";
import { ProductUtils } from "utils";
import { ProductService } from "./product.service";
import { UserService } from "./user.service";

export class CartService {
  static async addToUserCart({ userId, productId, quantity }: CartUserProduct) {
    const [_user, product] = await Promise.all([
      UserService.findOrFail("id", userId),
      ProductService.findOrFail("id", productId),
    ]);
    quantity ??= 1;

    if (!ProductUtils.isAvailable(product))
      throw new ConflictError(
        `The product ${`"${product.name}"`} is unavailable`,
        "UNAVAILABLE_PRODUCT"
      );

    if (!ProductUtils.isStockAvailable(product, quantity))
      throw new ConflictError(
        `Insufficient stock for the product "${product.name}"`
      );

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
    const [_user, product] = await Promise.all([
      UserService.findOrFail("id", userId),
      ProductService.findOrFail("id", productId),
    ]);
    quantity ??= 1;

    if (!ProductUtils.isAvailable(product))
      throw new ConflictError(
        `The product ${`"${product.name}"`} is unavailable`,
        "UNAVAILABLE_PRODUCT"
      );

    if (!ProductUtils.isStockAvailable(product, quantity))
      throw new ConflictError(
        `Insufficient stock for the product "${product.name}"`
      );

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
