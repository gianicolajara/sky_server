import { ServerProcess } from "@config/serverProcess.config";

/**
 * Console log helper to avoid console logs in production
 * @export
 * @class ConsoleHelper
 * @static log
 * @static error
 *
 */
export class ConsoleHelper {
  public static log(message?: any, ...optionalParams: any[]) {
    if (ServerProcess.ENV_MODE === "development") {
      console.log(message, ...optionalParams);
    }
  }

  public static error(message?: any, ...optionalParams: any[]) {
    if (ServerProcess.ENV_MODE === "development") {
      console.error(message, ...optionalParams);
    }
  }
}
