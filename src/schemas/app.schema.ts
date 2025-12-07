import z from "zod";

const MAX_SIGNED_INT = 2147483647;

export class AppSchema {
  static SignedInteger = z
    .number()
    .int()
    .max(MAX_SIGNED_INT)
    .min(-MAX_SIGNED_INT);
}
