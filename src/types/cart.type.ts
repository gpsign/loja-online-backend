import { Product, User } from "@prisma/client";

export type CartUserProduct = {
  userId: User["id"];
  productId: Product["id"];
  quantity?: number;
};
