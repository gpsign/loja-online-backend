import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  InvalidCredentialsError,
  NotFoundError,
} from "errors";
import { UserRepository } from "repositories";
import { UserRegistrationParams } from "types";

export class UserService {
  static async getUserByEmailOrFail(email: string): Promise<User> {
    const user = await UserRepository.findByEmail(email, {
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) throw new InvalidCredentialsError();

    return user;
  }

  static async createUser(params: UserRegistrationParams): Promise<User> {
    const { email, password, name, role } = params;
    await UserService.validateDuplicateEmail(email);

    const passwordHash = await bcrypt.hash(password, 12);
    return UserRepository.create({
      name,
      email,
      passwordHash,
      role,
    });
  }

  static async findOrFail<K extends keyof User>(
    key: K,
    value: NonNullable<Prisma.UserWhereUniqueInput[K]>,
    select: Prisma.UserSelect | null = null
  ) {
    const user = await UserRepository.findByKey(key, value, { select });

    if (!user)
      throw new NotFoundError(
        `Usuário não encontrado. key: "${key}"; value: "${value}"`
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

  static async changeStatus(
    userId: number,
    status: User["status"],
    senderId: number
  ) {
    const [user, sender] = await Promise.all([
      UserService.findOrFail("id", userId),
      UserService.findOrFail("id", senderId),
    ]);

    if (senderId != userId && sender.role != "admin")
      throw new ForbiddenError(
        "Você não tem permissão para alterar o status de outro usuário"
      );

    if (user.status === status) return;

    await UserRepository.updateUserStatus(userId, status);
  }
}
