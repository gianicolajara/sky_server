import { v4 as uuidv4 } from "uuid";

export class UUIDHelper {
  /**
   * Generates a version 4 UUID (random).
   *
   * @returns {string} The generated UUID.
   */
  public static generate() {
    return uuidv4();
  }
}
