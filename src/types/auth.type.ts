import { Session, User } from "@prisma/client";

export type SignInParams = {
  email: User["email"];
  password: User["passwordHash"];
};

export type CreateSessionParams = {
  userId: User["id"];
  ipAddress: Session["ipAddress"];
  userAgent: Session["userAgent"];
};

export type UserJWTData = CreateSessionParams;
