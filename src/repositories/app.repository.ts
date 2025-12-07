import { PrismaClient } from "@prisma/client";
import {
  CreateArgs,
  CreateReturn,
  DataCreate,
  FindUniqueReturn,
  ModelKeys,
  RealUniqueKeys,
  Select,
  WhereUnique,
} from "types";

export abstract class AppRepository<ModelName extends ModelKeys> {
  constructor(protected delegate: PrismaClient[ModelName]) {}

  async findByKey<K extends RealUniqueKeys<ModelName>>(
    key: K,
    value: NonNullable<WhereUnique<ModelName>[K]>,
    select?: Select<ModelName>
  ): Promise<FindUniqueReturn<ModelName>> {
    const where = { [key]: value } as unknown as WhereUnique<ModelName>;

    return (this.delegate as any).findUnique({
      where,
      select,
    });
  }

  async create(
    data: DataCreate<ModelName>,
    args?: Pick<CreateArgs<ModelName>, "select" | "omit" | "include">
  ): Promise<CreateReturn<ModelName>> {
    return (this.delegate as any).create({
      data,
      ...args,
    });
  }
}
