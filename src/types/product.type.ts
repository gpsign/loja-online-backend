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
