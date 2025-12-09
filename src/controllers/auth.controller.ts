import { AuthService } from "@services";
import { Request, Response } from "express";
import { SignInParams } from "@types";
import { Utils } from "@utils";

export class AuthController {
  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body as SignInParams;
    
    const ipAddress = Utils.nvl<string>(
      req.headers["x-forwarded-for"] as string,
      req.socket.remoteAddress
    );

    const userAgent = req.headers["user-agent"] ?? null;

    const result = await AuthService.signIn({
      email,
      password,
      ipAddress,
      userAgent,
    });

    return res.status(201).send(result);
  }
}
