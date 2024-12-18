import { ErrorHelper } from "@helpers/errors.helper";
import { UrlHelper } from "@helpers/url.helper";
import { NextFunction, Request, Response } from "express";

export class AuthGuard {
  /**
   * Middleware to check if the user is authenticated
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns a 401 response if the user is not authenticated
   */
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, jwt } = req.session;

      if (!userId || !jwt) {
        //delete cookies
        req.session.userId = undefined;
        req.session.jwt = undefined;

        req.session.save((err) => {
          if (err) {
            next(err);
          }

          req.session.destroy((err) => {
            if (err) {
              next(err);
            }
          });
        });

        //delete cookies frotend
        req.cookies["sky_session"] = undefined;

        res.clearCookie("sky_session", {
          path: "/",
          domain: process.env.DOMAIN,
        });

        res.status(401).json({
          message: ErrorHelper.unauthorized("Unauthorized").message,
          status: ErrorHelper.unauthorized("Unauthorized").code,
          _links: {
            path: req.path,
            self: UrlHelper.getFullUrlByRequest(req),
          },
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
