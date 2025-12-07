import { OrderItem, User } from "@prisma/client";

export type CreateOrder = {
  customerId: User["id"];
  totalAmount: number;
  items: Omit<OrderItem, "id">[];
};
