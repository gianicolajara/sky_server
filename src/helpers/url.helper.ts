import { Request } from "express";

export class UrlHelper {
  /**
   * Constructs the full URL from the given request object.
   * @param {Request} req - The express request object containing protocol, host, and original URL.
   * @returns {string} - The full URL as a string.
   */
  public static getFullUrlByRequest(req: Request): string {
    return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  }

  /**
   * Constructs the full URL for a given API version and base URL.
   * @param {string} version - The API version number.
   * @param {string} baseUrl - The base URL for the given API version.
   * @returns {string} - The full URL as a string.
   */
  public static generateVersionUrl(version: string, baseUrl: string): string {
    return `/${version}/${baseUrl}`;
  }
}
