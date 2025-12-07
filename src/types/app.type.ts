import { PrismaClient } from "@prisma/client";

export type AnyObject = Record<string, any>;

export type AnyArray = Array<any>;

export type ModelKeys = Exclude<keyof PrismaClient, `$${string}` | symbol>;

export type FindUniqueArgs<T extends ModelKeys> = Parameters<
  PrismaClient[T]["findUnique"]
>[0];

export type TransactionFunction = Parameters<PrismaClient["$transaction"]>[0];

export type TransactionTx = Parameters<TransactionFunction>[0];

export type FindByKeyConfig<T extends ModelKeys> = Partial<
  Omit<FindUniqueArgs<T>, "where">
>;

export type CreateArgs<T extends ModelKeys> = Parameters<
  PrismaClient[T]["create"]
>[0];

export type CreateConfig<T extends ModelKeys> = Omit<CreateArgs<T>, "data">;

export type WhereUnique<T extends ModelKeys> = FindUniqueArgs<T>["where"];

export type Select<T extends ModelKeys> = FindUniqueArgs<T>["select"];

export type RealUniqueKeys<T extends ModelKeys> = Exclude<
  keyof WhereUnique<T>,
  "AND" | "OR" | "NOT"
>;

export type DataCreate<T extends ModelKeys> = CreateArgs<T>["data"];

export type IncludeCreate<T extends ModelKeys> = CreateArgs<T>["include"];

export type SelectCreate<T extends ModelKeys> = CreateArgs<T>["select"];

export type OmitCreate<T extends ModelKeys> = CreateArgs<T>["omit"];

export type FindUniqueReturn<T extends ModelKeys> = Awaited<
  ReturnType<PrismaClient[T]["findUnique"]>
>;

export type CreateReturn<T extends ModelKeys> = Awaited<
  ReturnType<PrismaClient[T]["create"]>
>;
