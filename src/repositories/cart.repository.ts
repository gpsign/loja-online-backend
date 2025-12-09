import { Cart, User } from "@prisma/client";
import { prisma } from "@/prisma";
import { CartUserProduct } from "@types";
import { AppRepository } from "./app.repository.js";

class CartRepositoryClass extends AppRepository<"cart"> {
  constructor() {
    super(prisma.cart);
  }

  async getUserCart(userId: User["id"]) {
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
  async createItem({ userId, productId, quantity }: CartUserProduct) {
    quantity ??= 1;
    const cart = await this.getUserCart(userId);

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

  async deleteItem({ userId, productId }: CartUserProduct): Promise<void> {
    const cart = await this.getUserCart(userId);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });
  }

  async updateItemQuantity({
    userId,
    productId,
    quantity,
  }: CartUserProduct): Promise<Cart> {
    const cart = await this.getUserCart(userId);
    quantity ??= 1;
    return await prisma.$transaction(async (tx) => {
      if (quantity <= 0) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id, productId },
        });

        return await this.getUserCart(userId);
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

      return await this.getUserCart(userId);
    });
  }

  async clearCart(userId: User["id"]) {
    const cart = await this.getUserCart(userId);

    return prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });
    });
  }
}

const CartRepository = new CartRepositoryClass();

export { CartRepository };
