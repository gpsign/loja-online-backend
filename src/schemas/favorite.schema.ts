import z from "zod";

export class FavoriteSchema {
  static Query = z.object({
    count: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
  });
}
