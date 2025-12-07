import { Session } from "@prisma/client";
import { prisma } from "prisma";
import { AppRepository } from "./app.repository";

class SessionRepositoryClass extends AppRepository<"session"> {
  constructor() {
    super(prisma.session);
  }

  async findSession(token: Session["token"]) {
    return prisma.session.findFirst({
      where: {
        token,
      },
    });
  }
}

const SessionRepository = new SessionRepositoryClass();

export { SessionRepository };
