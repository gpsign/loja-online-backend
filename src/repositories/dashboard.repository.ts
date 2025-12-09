import { prisma } from "@/prisma";
import { BestSellerData, DashboardFilterDTO } from "@types";

export class DashboardRepository {
  static async getEarliestActivityDate(sellerId: number): Promise<Date | null> {
    const [firstSale, firstFavorite, firstCart] = await Promise.all([
      prisma.orderItem.findFirst({
        where: { sellerId },
        orderBy: { order: { createdAt: "asc" } },
        select: { order: { select: { createdAt: true } } },
      }),
      prisma.favorite.findFirst({
        where: { product: { sellerId } },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      }),
      prisma.cartItem.findFirst({
        where: { product: { sellerId } },
        orderBy: { addedAt: "asc" },
        select: { addedAt: true },
      }),
    ]);

    const dates: number[] = [];
    if (firstSale?.order?.createdAt)
      dates.push(firstSale.order.createdAt.getTime());
    if (firstFavorite?.createdAt) dates.push(firstFavorite.createdAt.getTime());
    if (firstCart?.addedAt) dates.push(firstCart.addedAt.getTime());

    if (dates.length === 0) return null;

    return new Date(Math.min(...dates));
  }

  static async getSalesInPeriod(filters: DashboardFilterDTO) {
    return prisma.orderItem.findMany({
      where: {
        sellerId: filters.sellerId,
        order: {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
          status: { not: "canceled" },
        },
      },
      select: {
        subtotal: true,
        quantity: true,
        order: {
          select: { createdAt: true },
        },
      },
      orderBy: { order: { createdAt: "asc" } },
    });
  }

  static async getFavoritesInPeriod(filters: DashboardFilterDTO) {
    return prisma.favorite.findMany({
      where: {
        product: { sellerId: filters.sellerId },
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  }

  static async getCartItemsInPeriod(filters: DashboardFilterDTO) {
    return prisma.cartItem.findMany({
      where: {
        product: { sellerId: filters.sellerId },
        addedAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      select: { addedAt: true, quantity: true },
      orderBy: { addedAt: "asc" },
    });
  }

  static async getBestSellerInPeriod(
    filters: DashboardFilterDTO
  ): Promise<BestSellerData | null> {
    const ranking = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        sellerId: filters.sellerId,
        order: {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
          status: { not: "canceled" },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 1,
    });

    const topItem = ranking[0];
    if (ranking.length === 0 || !topItem) {
      return null;
    }

    const productId = topItem.productId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true },
    });

    return {
      productId,
      name: product?.name || "Produto desconhecido",
      quantity: topItem._sum.quantity || 0,
      revenue: Number(topItem._sum.subtotal || 0),
    };
  }
}
