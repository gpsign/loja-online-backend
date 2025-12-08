import { User } from "@prisma/client";
import { Request, Response } from "express";
import { UserService } from "services";
import { UserRegistrationParams } from "types";

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
}
