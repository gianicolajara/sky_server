import * as crypto from "bcrypt";

/**
 * Crypto helper to ease password handling
 *
 * @export CryptoHelper
 * @class CryptoHelper
 * @description Crypto helper to ease password handling
 */
export class CryptoHelper {
  public static async hashPassword(password: string) {
    const saltRound = await crypto.genSalt(10);
    const hash = await crypto.hash(password, saltRound);
    return hash;
  }

  public static async comparePassword(password: string, hash: string) {
    return await crypto.compare(password, hash);
  }
}
