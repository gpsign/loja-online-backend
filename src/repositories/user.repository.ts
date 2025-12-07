import { Prisma, User } from "@prisma/client";
import { prisma } from "prisma";
import { AppRepository } from "./app.repository";
import { FindByKeyConfig } from "types";

class UserRepositoryClass extends AppRepository<"user"> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string, args?: FindByKeyConfig<"user">) {
    return this.findByKey("email", email, args);
  }

  async findById(id: User["id"], args?: FindByKeyConfig<"user">) {
    return this.findByKey("id", id, args);
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
const UserRepository = new UserRepositoryClass();

export { UserRepository };
