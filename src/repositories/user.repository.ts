import { Prisma, User } from "@prisma/client";
import { prisma } from "prisma";

export class UserRepository {
  static async findByKey<K extends keyof User>(
    key: K,
    value: NonNullable<Prisma.UserWhereUniqueInput[K]>,
    select: Prisma.UserSelect | null = null
  ) {
    const where = { [key]: value } as unknown as Prisma.UserWhereUniqueInput;

    return prisma.user.findUnique({
      where,
      select,
    });
  }

  static async findByEmail(email: string, select?: Prisma.UserSelect) {
    return UserRepository.findByKey("email", email, select);
  }

  static async findById(id: User["id"], select?: Prisma.UserSelect) {
    return UserRepository.findByKey("id", id, select);
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
