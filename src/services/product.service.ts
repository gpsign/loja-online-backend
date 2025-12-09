import { Prisma, Product, User } from "@prisma/client";
import { NotFoundError } from "errors";
import { ProductRepository, UserRepository } from "repositories";
import {
  CreateProductParams,
  FindByKeyConfig,
  ProductQueryConfig,
} from "types";
import { ProductUtils } from "utils";

export class ProductService {
  static async createProduct(params: CreateProductParams): Promise<Product> {
    const { config, images, sellerId, ...restParams } = params;

    const createData: Prisma.ProductCreateInput = {
      ...restParams,
      seller: { connect: { id: sellerId } },
    };

    console.log(config);

    if (config) {
      createData.config = { create: config };
    }

    if (images) {
      createData.images = { create: ProductUtils.prepareImages(images) };
    }

    const newProduct = await ProductRepository.create(createData);

    return newProduct;
  }

  static async findOrFail<K extends keyof Product>(
    key: K,
    value: NonNullable<Prisma.ProductWhereUniqueInput[K]>,
    args?: FindByKeyConfig<"product">
  ) {
    const product = await ProductRepository.findByKey(key, value, args);

    if (!product)
      throw new NotFoundError(
        `Produto não encontrado. key: "${key}"; value: "${value}"`
      );

    return product;
  }

  static async listUserProducts(userId: User["id"]) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return await ProductRepository.findManyByUser(userId);
  }

  static async listProducts(
    params: ProductQueryConfig & { userId: User["id"] }
  ) {
    return await ProductRepository.findAll(params);
  }
}
