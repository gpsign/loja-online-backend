import { Request, Response } from "express";
import { ProductService, UserService } from "@services";
import { AuthRequest, UserRegistrationParams } from "@types";

export class UserControler {
  static async signUser(req: Request, res: Response) {
    const { email, password, name, confirmPassword, role } =
      req.body as UserRegistrationParams;

    const user = await UserService.createUser({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
    });
  }

  static async getUserProducts(req: Request, res: Response) {
    const userId = Number(req.params["id"]);
    const products = await ProductService.listUserProducts(userId);
    return res.status(200).json(products);
  }

  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    await UserService.changeStatus(
      Number(id),
      status,
      (req as AuthRequest).userId
    );

    return res.status(201).json({ id });
  }
}
