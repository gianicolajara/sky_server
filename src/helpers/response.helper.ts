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

  public static error(err: any, req: Request, res: Response) {
    res.status(typeof err.code === "number" ? err.code : 500).json({
      message: err.message ?? ErrorMessageConfig.INTERNAL.message,
      status: err.code ?? ErrorMessageConfig.INTERNAL.code,
      _links: { path: req.path, self: UrlHelper.getFullUrlByRequest(req) },
    });
  }

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

  public static MulterError(err: MulterError, req: Request, res: Response) {
    res.status(400).json({
      message: err.message,
      status: 400,
      _links: { path: req.path, self: UrlHelper.getFullUrlByRequest(req) },
    });
  }
}
