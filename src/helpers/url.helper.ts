import { Request } from "express";

export class UrlHelper {
  public static getFullUrlByRequest(req: Request): string {
    return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  }

  public static generateVersionUrl(version: string, baseUrl: string): string {
    return `/${version}/${baseUrl}`;
  }
}
