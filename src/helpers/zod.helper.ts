import { Request } from "express";
import { AnyZodObject, z } from "zod";

export class ZodHelper {
  static validateSchema = <T extends AnyZodObject>(
    schema: T,
    req: Request
  ): z.infer<T> => {
    const zodResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!zodResult.success) throw zodResult.error;

    return zodResult.data;
  };

  static validateParcialSchema = <T extends AnyZodObject>(
    schema: T,
    req: Request
  ): z.infer<T> => {
    const zodResult = schema.partial().safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!zodResult.success) throw zodResult.error;

    return zodResult.data;
  };
}
