import { OrderItem, Product, User } from "@prisma/client";
import { TransactionTx } from "./app.type.js";

export type CreateOrder = {
  customerId: User["id"];
  totalAmount: number;
  items: CreateOrderItem[];
  tx: TransactionTx;
};

export interface CreateOrderItem
  extends Omit<OrderItem, "id" | "orderId" | "unitPrice" | "subtotal"> {
  unitPrice: number;
  subtotal: number;
}

export type OrderItemSnapshot = {
  productId: Product["id"];
  sellerId: User["id"];
  quantity: number;
  unitPrice: number;
  subtotal: number;
};
