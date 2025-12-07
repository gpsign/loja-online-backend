import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AppError,
  ConflictError,
  InvalidCredentialsError,
  NotFoundError,
} from "errors";
import { UserRepository } from "repositories";
import { UserRegistrationParams } from "types";

export class UserService {
  static async getUserByEmailOrFail(email: string): Promise<User> {
    const user = await UserRepository.findByEmail(email, {
      id: true,
      email: true,
      passwordHash: true,
    });

    if (!user) throw new InvalidCredentialsError();

    return user;
  }

  static async createUser(params: UserRegistrationParams): Promise<User> {
    const { email, password, name } = params;
    await UserService.validateDuplicateEmail(email);

    const passwordHash = await bcrypt.hash(password, 12);
    return UserRepository.create({
      name,
      email,
      passwordHash,
    });
  }

  static async findOrFail<K extends keyof User>(
    key: K,
    value: NonNullable<Prisma.UserWhereUniqueInput[K]>,
    select: Prisma.UserSelect | null = null
  ) {
    const user = await UserRepository.findByKey(key, value, select);

    if (!user)
      throw new NotFoundError(
        `User not found.\nkey: ${key}\nvalue: "${value}"`
      );

    return user;
  }

  static async validateDuplicateEmail(email: string) {
    const duplicate = await UserRepository.findByEmail(email);
    if (duplicate) {
      throw new ConflictError(
        "User with this email already exists.",
        "USER_ALREADY_EXISTS"
      );
    }
  }
}
