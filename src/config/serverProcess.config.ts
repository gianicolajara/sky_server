import { config } from "dotenv";
import path from "path";

export class ServerProcess {
  static ENV_MODE: string;
  static PORT: number;
  static JWT_SECRET: string;
  static COOKIE_SECRET: string;
  static SESSION_SECRET: string;
  static DB_NAME: string;
  static DB_PASSWORD: string;
  static DB_PORT: number;
  static DB_USER: string;
  static DB_HOST: string;
  static CSRF_SECRET: string;
  static VERSION_NAME = "v1";
  static AVATAR_FOLDER = path.resolve("src", "public", "uploads", "avatar");
  static POST_IMAGES_FOLDER = path.resolve(
    "src",
    "public",
    "uploads",
    "posts",
    "images"
  );

  static init = () => {
    this.ENV_MODE = process.env.NODE_ENV || "development";

    this.dotenvConfig();
    this.PORT = Number(process.env.PORT || 3000);
    this.JWT_SECRET = process.env.JWT_SECRET ?? "secret";
    this.COOKIE_SECRET = process.env.COOKIE_SECRET ?? "secret";
    this.SESSION_SECRET = process.env.SESSION_SECRET ?? "secret";
    this.DB_NAME = process.env.DB_NAME ?? "db_name";
    this.DB_PASSWORD = process.env.DB_PASSWORD ?? "password";
    this.DB_PORT = Number(process.env.DB_PORT ?? 3306);
    this.DB_USER = process.env.DB_USER ?? "db_user";
    this.DB_HOST = process.env.DB_HOST ?? "localhost";
    this.CSRF_SECRET = process.env.CSRF_SECRET ?? "secret";
  };

  private static dotenvConfig = () => {
    config({
      path: {
        development: ".env.dev",
        test: ".env.test",
        production: ".env",
      }[this.ENV_MODE],
      encoding: "UTF-8",
    });
  };
}
