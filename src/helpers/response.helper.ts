import { ErrorMessageConfig } from "@config/errorMessages.config";
import { Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { UrlHelper } from "./url.helper";

type ResponseProps = {
  message: string;
  method: string;
  _links: {
    path: string;
    self: string;
  };
  data?: any;
};

export class ResponseHelper {
  /**
   * Response helper for successfull requests
   * @param {string} message - The message to return
   * @param {any} data - The data to return
   * @param {Request} req - The express request object
   * @returns {ResponseProps} - The response object
   */
  public static success(message: string, data: any, req: Request) {
    let response: ResponseProps = {
      message,
      method: req.method,
      _links: {
        path: req.path,
        self: UrlHelper.getFullUrlByRequest(req),
      },
    };

    if (data) {
      response = {
        ...response,
        data: data,
      };
    }

    return response;
  }

  /**
   * Response helper for error responses
   * @param {any} err - The error object
   * @param {Request} req - The express request object
   * @param {Response} res - The express response object
   */
  public static error(err: any, req: Request, res: Response) {
    res.status(typeof err.code === "number" ? err.code : 500).json({
      message: err.message ?? ErrorMessageConfig.INTERNAL.message,
      status: err.code ?? ErrorMessageConfig.INTERNAL.code,
      _links: { path: req.path, self: UrlHelper.getFullUrlByRequest(req) },
    });
  }

  /**
   * Handles Zod validation errors and sends a structured JSON response.
   * @param {ZodError} err - The Zod validation error object.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @description Flattens the Zod error details and responds with a 400 status and field errors.
   */
  public static ZodError(err: ZodError, req: Request, res: Response) {
    const errorFlatten = err.flatten((issue) => {
      return {
        code: issue.code,
        message: issue.message,
        path: issue.path,
      };
    });

    res.status(400).json({
      message: "Field Errors",
      errors: errorFlatten.fieldErrors,
      status: 400,
      _links: { path: req.path, self: UrlHelper.getFullUrlByRequest(req) },
    });
  }

  /**
   * Handles Multer errors and sends a structured JSON response with a 400 status.
   * @param {MulterError} err - The Multer error object.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @description Responds with the error message and status code, including request path and URL.
   */
  public static MulterError(err: MulterError, req: Request, res: Response) {
    res.status(400).json({
      message: err.message,
      status: 400,
      _links: { path: req.path, self: UrlHelper.getFullUrlByRequest(req) },
    });
  }
}
