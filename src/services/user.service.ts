import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { ConflictError, InvalidCredentialsError } from "errors";
import { UserRepository } from "repositories";
import { UserRegistrationParams } from "types";

export class UserService {
  static async getUserOrFail(email: string): Promise<User> {
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
