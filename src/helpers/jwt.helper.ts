import { ServerProcess } from "@config/serverProcess.config";
import * as jwt from "jsonwebtoken";

export class JwtHelper {
  /**
   * Generates a JWT token from the given payload
   * @param payload the payload to encode in the token
   * @returns a JWT token
   */
  public static generateToken(payload: any) {
    return jwt.sign(payload, ServerProcess.JWT_SECRET, { expiresIn: "1d" });
  }

  /**
   * Verifies a JWT token and returns the decoded payload
   * @param token the token to verify
   * @returns the decoded payload
   */
  public static verifyToken(token: string) {
    return jwt.verify(token, ServerProcess.JWT_SECRET);
  }
}
