import { ProductStatus } from "@prisma/client";

export interface CreateProductParams {
  sellerId: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  sku?: string;
  stockQuantity: number;
  isStockInfinite: boolean;
  status?: ProductStatus;

  images?: {
    imageUrl: string;
    isCover?: boolean;
    displayOrder?: number;
  }[];

  config?: {
    showStockWarning?: boolean;
    stockThresholdOverride?: number;
  };
}

export interface ProductQueryConfig {
  page?: number;
  size?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: "price" | "createdAt" | "name";
  orderType?: "asc" | "desc";
}

export interface ProductQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}
