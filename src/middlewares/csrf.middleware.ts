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
      secure: false,
      sameSite: "lax",
      path: "/",
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
