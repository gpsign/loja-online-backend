import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "services";
import { SessionRepository } from "repositories";
import { InvalidCredentialsError } from "errors";
import { Utils } from "utils";
import { User } from "@prisma/client";
import { AppEnv } from "config";
import { CreateSessionParams, SignInParams } from "types";
import dayjs from "dayjs";

export class AuthService {
  static async signIn(
    params: Omit<SignInParams & CreateSessionParams, "userId">
  ): Promise<any> {
    const { email, password } = params;

    const user = await UserService.getUserOrFail(email);

    await AuthService.validatePasswordOrFail(password, user.passwordHash);

    const token = await AuthService.createSession({
      ...params,
      userId: user.id,
    });

    const clearedUser = Utils.omit(user, "passwordHash");

    return {
      user: clearedUser,
      token,
    };
  }

  static async createSession({
    userId,
    ipAddress,
    userAgent,
  }: CreateSessionParams) {
    const expirationDate = dayjs().add(7, "days");

    const token = jwt.sign(
      { userId, ipAddress, userAgent },
      AppEnv.JWT_SECRET,
      {
        expiresIn: expirationDate.unix(),
      }
    );

    await SessionRepository.createSession({
      expiresAt: expirationDate.toDate(),
      token,
      ipAddress,
      userAgent,
      user: { connect: { id: userId } },
    });

    return token;
  }

  static async validatePasswordOrFail(
    password: User["passwordHash"],
    hashPassword: User["passwordHash"]
  ) {
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    if (!isPasswordValid) throw new InvalidCredentialsError();
  }
}
