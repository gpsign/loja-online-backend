import { Session, User } from "@prisma/client";
import { Request } from "express";
export type SignInParams = {
  email: User["email"];
  password: User["passwordHash"];
};

export type CreateSessionParams = {
  userId: User["id"];
  ipAddress: Session["ipAddress"];
  userAgent: Session["userAgent"];
};

export type UserJWTData = CreateSessionParams & { iat: number; exp: number };

export type AuthRequest = Request & { userId: User["id"] };
