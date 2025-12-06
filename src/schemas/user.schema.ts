import z from "zod";
import { AuthSchema } from "./auth.schema";

export class UserSchema {
  static Registration = z
    .object({
      name: z.string().min(3),
      email: z.email(),
      password: AuthSchema.Password,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    });
}
