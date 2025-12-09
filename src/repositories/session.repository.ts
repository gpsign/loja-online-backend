import { Session } from "@prisma/client";
import { AppRepository } from "@repositories";
import { prisma } from "@/prisma";

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
