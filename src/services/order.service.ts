import { Product, ProductConfig, User } from "@prisma/client";
import { BadRequestError, ConflictError } from "errors";
import { prisma } from "prisma";
import {
  CartRepository,
  OrderRepository,
  ProductRepository,
} from "repositories";
import { OrderItemSnapshot } from "types";

export class OrderService {
  static async orderCart(userId: User["id"]) {
    const cart = await CartRepository.getUserCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("O carrinho está vazio", "EMPTY_CART");
    }

    let totalAmount = 0;
    const orderItems: OrderItemSnapshot[] = [];
    const productsToUpdateStock: { id: number; newStock: number }[] = [];

    for (const item of cart.items) {
      const productData = (await ProductRepository.findByKey(
        "id",
        item.productId,
        {
          include: { config: true },
        }
      )) as Product & { config: ProductConfig | null };

      const inactive = Boolean(productData?.status !== "active");

      if (inactive || !productData)
        throw new ConflictError(
          `O produto ${
            productData?.name ? `"${productData.name}"` : ""
          } está indisponível`,
          "UNAVAILABLE_PRODUCT"
        );

      const sufficientStock =
        productData.config?.isStockInfinite != false ||
        productData.stockQuantity >= item.quantity;

      if (!sufficientStock)
        throw new ConflictError(
          `Estoque insuficiente do produto "${productData.name}"`,
          "INSUFFICIENT_STOCK"
        );

      const unitPrice = productData.price.toNumber();
      const subtotal = unitPrice * item.quantity;

      totalAmount += subtotal;

      orderItems.push({
        productId: item.productId,
        sellerId: productData.sellerId,
        quantity: item.quantity,
        unitPrice: unitPrice,
      });

      if (productData.config?.isStockInfinite != false) continue;

      productsToUpdateStock.push({
        id: productData.id,
        newStock: productData.stockQuantity - item.quantity,
      });
    }

    return prisma.$transaction(
      async (tx) => {
        const createdOrder = await OrderRepository.orderItems({
          tx,
          customerId: userId,
          totalAmount,
          items: orderItems as any,
        });

        const stockPromises = productsToUpdateStock.map((p) =>
          tx.product.update({
            where: { id: p.id },
            data: { stockQuantity: p.newStock },
          })
        );
        await Promise.all(stockPromises);

        await CartRepository.clearCart(userId);
        return createdOrder;
      },
      { isolationLevel: "Serializable" }
    );
  }

  static async getOrders(userId: User["id"]) {
    const cart = await OrderRepository.findManyByKey("customerId", userId, {
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isCover: true }, take: 1 } },
            },
          },
        },
      },
    });
    return cart;
  }
}
