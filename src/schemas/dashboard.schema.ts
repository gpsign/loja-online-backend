import z from "zod";

export class DashboardSchema {
  static Date = z
    .string()
    .transform((v) => new Date(v))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Data inválida",
    });

  static Metrics = z.object({
    startDate: DashboardSchema.Date.optional(),
    endDate: DashboardSchema.Date.optional(),
  });
}
