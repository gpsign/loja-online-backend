import { UserSchema } from "@schemas";
import z from "zod";

export type UserRegistrationParams = z.infer<typeof UserSchema.Registration>;
