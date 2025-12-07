import { Prisma, Product } from "@prisma/client";
import { ProductRepository } from "repositories";
import { CreateProductParams } from "types";
import { ProductUtils } from "utils";

export class ProductService {
  static async createProduct(params: CreateProductParams): Promise<Product> {
    const { config, images, sellerId, ...restParams } = params;

    const createData: Prisma.ProductCreateInput = {
      ...restParams,
      seller: { connect: { id: sellerId } },
    };

    if (config) {
      createData.config = { create: config };
    }

    if (images) {
      createData.images = { create: ProductUtils.prepareImages(images) };
    }

    const newProduct = await ProductRepository.create(createData);

    return newProduct;
  }
}
