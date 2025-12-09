import { Prisma, User } from "@prisma/client";
import { prisma } from "@/prisma";
import { AppRepository } from "./app.repository.js";
import { FindByKeyConfig } from "@types";

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

  async updateUserStatus(userId: number, newStatus: User["status"]) {
    const shouldDeactivateProducts = newStatus === "inactive";

    if (!shouldDeactivateProducts)
      return prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
      });

    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
      }),

      prisma.product.updateMany({
        where: { sellerId: userId },
        data: { status: "inactive" },
      }),
    ]);
  }
}
const UserRepository = new UserRepositoryClass();

export { UserRepository };
