import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { ConsoleHelper } from "./console.helper";
import { ResponseHelper } from "./response.helper";

/**
 * Handling error in express helper
 * @export HandlingErrorHelper
 * @class HandlingErrorHelper
 * @description Handling error in express as middleware
 */
export class HandlingErrorHelper {
  constructor() {}

  static errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    ConsoleHelper.log("Inside error handler");
    ConsoleHelper.error(err);

    if (err instanceof multer.MulterError) {
      ResponseHelper.MulterError(err, req, res);
      return;
    }

    if (err instanceof ZodError) {
      ResponseHelper.ZodError(err, req, res);
      return;
    }

    if (err) {
      ResponseHelper.error(err, req, res);
      return;
    }

    next();
  }
}
