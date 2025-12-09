import { DashboardController } from "@controllers";
import { Router } from "express";
import { validateQuery } from "@middlewares";
import { DashboardSchema } from "@schemas";

const DashboardRouter = Router();

DashboardRouter.get(
  "/dashboard",
  validateQuery(DashboardSchema.Metrics),
  DashboardController.getMetrics
);

export { DashboardRouter };
