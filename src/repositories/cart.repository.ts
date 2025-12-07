import { Cart, Prisma, User } from "@prisma/client";
import { prisma } from "prisma";
import { CartUserProduct } from "types";

export class CartRepository {
  static async getUserCart(userId: User["id"]) {
    const include = {
      items: {
        orderBy: { addedAt: "asc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: {
                where: { isCover: true },
                take: 1,
              },
            },
          },
        },
      },
    } as const;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include,
    });

    if (cart) return cart;
    return await prisma.cart.create({
      data: { userId },
      include,
    });
  }
  static async createItem({ userId, productId, quantity }: CartUserProduct) {
    quantity ??= 1;
    const cart = await CartRepository.getUserCart(userId);

    return prisma.$transaction(async (tx) => {
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId,
            quantity: quantity,
          },
        });
      }

      return tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: {
          items: {
            orderBy: { addedAt: "asc" },
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                  images: {
                    where: { isCover: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  static async deleteItem({
    userId,
    productId,
  }: CartUserProduct): Promise<void> {
    const cart = await CartRepository.getUserCart(userId);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });
  }

  static async updateItemQuantity({
    userId,
    productId,
    quantity,
  }: CartUserProduct): Promise<Cart> {
    const cart = await CartRepository.getUserCart(userId);
    quantity ??= 1;
    return await prisma.$transaction(async (tx) => {
      if (quantity <= 0) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id, productId },
        });

        return await CartRepository.getUserCart(userId);
      }

      const result = await tx.cartItem.updateMany({
        where: { cartId: cart.id, productId },
        data: { quantity },
      });

      if (result.count === 0) {
        await tx.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }

      return await CartRepository.getUserCart(userId);
    });
  }
}
