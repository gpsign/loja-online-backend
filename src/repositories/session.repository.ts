import { Prisma, Session } from "@prisma/client";
import { prisma } from "prisma";

export class SessionRepository {
  static async createSession(data: Prisma.SessionCreateInput) {
    return prisma.session.create({
      data,
    });
  }

  static async findSession(token: Session["token"]) {
    return prisma.session.findFirst({
      where: {
        token,
      },
    });
  }
}
