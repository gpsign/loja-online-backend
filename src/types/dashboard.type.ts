export interface DashboardFilterDTO {
  sellerId: number;
  startDate: Date;
  endDate: Date;
}

export interface DashboardChartData {
  date: string;
  fullDate: string;
  revenue: number;
  salesCount: number;
  favorites: number;
  inCarts: number;
}

export interface BestSellerData {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardResponse {
  chart: DashboardChartData[];
  bestSeller: BestSellerData | null;
}
