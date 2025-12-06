import { Prisma } from "@prisma/client";
import { prisma } from "prisma";

export class UserRepository {
  static async findByEmail(email: string, select?: Prisma.UserSelect) {
    const params: any = {
      where: {
        email,
      },
    };

    if (select) {
      params.select = select;
    }

    return prisma.user.findUnique(params);
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
