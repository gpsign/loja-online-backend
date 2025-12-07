import { Prisma, User } from "@prisma/client";
import { prisma } from "prisma";
import { AppRepository } from "./app.repository";

class UserRepositoryClass extends AppRepository<"user"> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string, select?: Prisma.UserSelect) {
    return this.findByKey("email", email, select);
  }

  async findById(id: User["id"], select?: Prisma.UserSelect) {
    return this.findByKey("id", id, select);
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
const UserRepository = new UserRepositoryClass();

export { UserRepository };
