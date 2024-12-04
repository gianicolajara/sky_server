import { v4 as uuidv4 } from "uuid";

export class UUIDHelper {
  public static generate() {
    return uuidv4();
  }
}
