import { Product, User } from "@prisma/client";

export type CreateFavoriteParams = {
  productId: Product["id"];
  userId: User["id"];
};
