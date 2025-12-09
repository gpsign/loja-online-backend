import { Request, Response } from "express";
import { DashboardService } from "@services";
import { AuthRequest } from "@types";

export class DashboardController {
  static async getMetrics(req: Request, res: Response) {
    const sellerId = (req as AuthRequest)?.userId;

    const { startDate, endDate } = req.query;

    const data = await DashboardService.getDashboardMetrics(
      Number(sellerId),
      String(startDate),
      String(endDate)
    );

    return res.status(200).json(data);
  }
}
