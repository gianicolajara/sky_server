import { ServerProcess } from "@config/serverProcess.config";
import { ConsoleHelper } from "@helpers/console.helper";
import { doubleCsrf } from "csrf-csrf";
import { NextFunction, Request, Response } from "express";

export class CsrfMiddleware {
  public static csrf = doubleCsrf({
    getSecret: () => ServerProcess.CSRF_SECRET,
    cookieName: "csrftoken",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  });

  static generateTokenRoute(req: Request, res: Response, _: NextFunction) {
    try {
      const csrfToken = this.csrf.generateToken(req, res);

      res.status(200).json({
        csrfToken,
      });
    } catch (error) {
      ConsoleHelper.error(error);
    }
  }
}
