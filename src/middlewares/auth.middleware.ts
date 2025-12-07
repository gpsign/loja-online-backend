import { AppEnv } from "config";
import { UnauthorizedError } from "errors";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SessionRepository } from "repositories";
import { AuthRequest, UserJWTData } from "types";

export async function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
  if (!authHeader) throw new UnauthorizedError();

  const token = authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError();

  const userData = jwt.verify(token, AppEnv.JWT_SECRET) as UserJWTData;

  const session = await SessionRepository.findSession(token);
  if (!session) throw new UnauthorizedError();

  (req as AuthRequest).userId = userData.userId;

  next();
}
