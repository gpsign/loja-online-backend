import { OrderItem, Product, User } from "@prisma/client";
import { TransactionTx } from "./app.type";

export type CreateOrder = {
  customerId: User["id"];
  totalAmount: number;
  items: Omit<OrderItem, "id">[];
  tx: TransactionTx;
};

export type OrderItemSnapshot = {
  productId: Product["id"];
  sellerId: User["id"];
  quantity: number;
  unitPrice: number;
};
