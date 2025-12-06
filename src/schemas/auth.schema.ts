import { z } from "zod";

export class AuthSchema {
  static SignIn = z.object({
    email: z.email(),
    password: z.string(),
  });

  static Password = z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula.",
    })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[\W_]/, {
      message:
        "A senha deve conter pelo menos um caractere especial (ex: !@#$).",
    });
}
