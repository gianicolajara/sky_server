import { UUIDHelper } from "@helpers/uuid.helper";
import session from "express-session";
import { ServerProcess } from "./serverProcess.config";

export class SessionConfig {
  static init(sessionStore: session.Store): session.SessionOptions {
    return {
      genid() {
        return UUIDHelper.generate();
      },
      secret: ServerProcess.SESSION_SECRET,
      cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
      },
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      name: "sky_session",
    };
  }

  static generateSessionStore() {
    return {
      host: ServerProcess.DB_HOST,
      port: ServerProcess.DB_PORT,
      user: ServerProcess.DB_USER,
      password: ServerProcess.DB_PASSWORD,
      database: ServerProcess.DB_NAME,
      charset: "utf8mb4",
    };
  }
}
