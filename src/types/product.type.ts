import { ProductStatus } from "@prisma/client";

export interface CreateProductParams {
  sellerId: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  sku?: string;
  stockQuantity: number;
  status?: ProductStatus;

  images?: {
    imageUrl: string;
    isCover?: boolean;
    displayOrder?: number;
  }[];

  config?: {
    isStockInfinite: boolean;
    showStock?: boolean;
  };
}

export type MassCreateProductParams =
  | CreateProductParams
  | { products: CreateProductParams[] };

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
