import { Order, OrderStatus } from "@prisma/client";
import { prisma } from "@/prisma";
import { CreateOrder } from "@types";
import { AppRepository } from "./app.repository.js";
class OrderRepositoryClass extends AppRepository<"order"> {
  constructor() {
    super(prisma.order);
  }

  async orderItems({ items, tx, ...data }: CreateOrder): Promise<Order> {
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
  }
}

const OrderRepository = new OrderRepositoryClass();

export { OrderRepository };
