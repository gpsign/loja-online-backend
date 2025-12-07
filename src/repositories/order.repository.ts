import { Order, OrderStatus } from "@prisma/client";
import { prisma } from "prisma";
import { CreateOrder } from "types";
import { AppRepository } from "./app.repository";
class OrderRepositoryClass extends AppRepository<"order"> {
  constructor() {
    super(prisma.order);
  }

  async createOrderAndItems({ items, ...data }: CreateOrder): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...data,
          status: OrderStatus.pending,
          items: {
            createMany: {
              data: items,
              skipDuplicates: true,
            },
          },
        },
        include: { items: true },
      });

      return order;
    });
  }
}

const OrderRepository = new OrderRepositoryClass();

export { OrderRepository };
