import {
  eachDayOfInterval,
  endOfDay,
  format,
  isSameDay,
  startOfDay,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ForbiddenError } from "@errors";
import { DashboardRepository, UserRepository } from "@repositories";
import {
  DashboardChartData,
  DashboardFilterDTO,
  DashboardResponse,
} from "@types";

function isValid(str: unknown): str is string {
  if (typeof str != "string") return false;
  if (str == "undefined" || !str) return false;
  return true;
}

export class DashboardService {
  static async getDashboardMetrics(
    sellerId: number,
    startStr?: string,
    endStr?: string
  ): Promise<DashboardResponse> {
    const user = await UserRepository.findById(sellerId);

    if (user?.role == "customer")
      throw new ForbiddenError("Somente vendedores tem acesso ao dashboard");

    const endDate = isValid(endStr)
      ? endOfDay(new Date(endStr!))
      : endOfDay(new Date());

    let startDate: Date;

    if (isValid(startStr)) {
      startDate = startOfDay(new Date(startStr!));
    } else {
      const earliestActivity =
        await DashboardRepository.getEarliestActivityDate(sellerId);

      startDate = earliestActivity
        ? startOfDay(earliestActivity)
        : startOfDay(subDays(new Date(), 7));
    }

    const filters: DashboardFilterDTO = {
      sellerId,
      startDate,
      endDate,
    };

    const [salesRaw, favoritesRaw, cartItemsRaw, bestSeller] =
      await Promise.all([
        DashboardRepository.getSalesInPeriod(filters),
        DashboardRepository.getFavoritesInPeriod(filters),
        DashboardRepository.getCartItemsInPeriod(filters),
        DashboardRepository.getBestSellerInPeriod(filters),
      ]);

    let intervalDays: Date[] = [];
    if (startDate <= endDate) {
      intervalDays = eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      intervalDays = [startDate];
    }

    const chartData: DashboardChartData[] = intervalDays.map((day) => {
      const salesDay = salesRaw.filter((s) =>
        isSameDay(new Date(s.order.createdAt), day)
      );
      const revenue = salesDay.reduce(
        (acc, curr) => acc + Number(curr.subtotal || 0),
        0
      );
      const salesCount = salesDay.reduce((acc, curr) => acc + curr.quantity, 0);

      const favoritesCount = favoritesRaw.filter((f) =>
        isSameDay(new Date(f.createdAt), day)
      ).length;

      const cartAddsCount = cartItemsRaw.filter((c) =>
        isSameDay(new Date(c.addedAt), day)
      ).length;

      return {
        date: format(day, "dd/MM", { locale: ptBR }),
        fullDate: day.toISOString(),
        revenue: Number(revenue.toFixed(2)),
        salesCount,
        favorites: favoritesCount,
        inCarts: cartAddsCount,
      };
    });

    return { chart: chartData, bestSeller };
  }
}
