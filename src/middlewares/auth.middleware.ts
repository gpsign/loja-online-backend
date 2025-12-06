import { AppEnv } from "config";
import { UnauthorizedError } from "errors";
import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { SessionRepository } from "repositories";

export async function authenticateToken(
  req: any,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
  if (!authHeader) throw new UnauthorizedError();

  const token = authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError();

  const a: any = jwt.verify(token, AppEnv.JWT_SECRET);

  const session = await SessionRepository.findSession(token);
  if (!session) throw new UnauthorizedError();

  req.userId = a.userId;
  next();
}
