import z from "zod";
import { AppSchema } from "./app.schema";

export class CartSchema {
  static Quantity = AppSchema.SignedInteger;

  static ProductID = z.number();

  static Product = z.object({
    productId: CartSchema.ProductID,
  });

  static PutQuantity = z.object({
    productId: CartSchema.ProductID,
    quantity: CartSchema.Quantity,
  });

  static AddItem = z.object({
    productId: CartSchema.ProductID,
    quantity: CartSchema.Quantity.optional(),
  });
}
