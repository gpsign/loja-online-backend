import { CartController } from "@controllers";
import { Router } from "express";
import { validateBody } from "@middlewares";
import { CartSchema } from "@schemas";

const CartRouter = Router();

CartRouter.post(
  "/cart",
  validateBody(CartSchema.AddItem),
  CartController.addToCart
)
  .delete(
    "/cart",
    validateBody(CartSchema.Product),
    CartController.removeFromCart
  )
  .put(
    "/cart",
    validateBody(CartSchema.PutQuantity),
    CartController.updateQuantity
  )
  .get("/cart", CartController.listCartItems);

export { CartRouter };
