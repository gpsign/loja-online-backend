import { Product, ProductConfig } from "@prisma/client";
import _ from "lodash";
import { CreateProductParams } from "types";

export class ProductUtils {
  static prepareImages(images: CreateProductParams["images"]) {
    if (!images) return [];

    const hasCover = images.some((img) => Boolean(img.isCover));

    return _.sortBy(
      images.map((original, i) => {
        const img = { ...original };
        img.displayOrder ??= (i + 1) * 10;
        if (!hasCover && i == 0) img.isCover = true;
        if (img.isCover) img.displayOrder = 0;
        return img;
      }),
      "displayOrder"
    );
  }

  static isAvailable(product: Product) {
    return product && product.status === "active";
  }

  static isStockAvailable(
    product: Product & { config?: ProductConfig },
    quantity: number
  ) {
    if (!quantity || product.config?.isStockInfinite != false) return true;
    return product.stockQuantity >= quantity;
  }
}
