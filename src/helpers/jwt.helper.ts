import { ServerProcess } from "@config/serverProcess.config";
import * as jwt from "jsonwebtoken";

export class JwtHelper {
  public static generateToken(payload: any) {
    return jwt.sign(payload, ServerProcess.JWT_SECRET, { expiresIn: "1d" });
  }

  public static verifyToken(token: string) {
    return jwt.verify(token, ServerProcess.JWT_SECRET);
  }
}
