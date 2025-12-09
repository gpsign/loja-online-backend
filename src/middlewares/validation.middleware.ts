import { NextFunction, Request, Response } from "express";
import { RequestLocation } from "@types";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType, location: RequestLocation) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req[location] ?? {};

      const validatedData = await schema.parseAsync(data);

      if (location === "body") req[location] = validatedData;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateBody = (schema: ZodType) => validate(schema, "body");

export const validateQuery = (schema: ZodType) => validate(schema, "query");

export const validateParams = (schema: ZodType) => validate(schema, "params");
