import { ErrorMessageConfig } from "@config/errorMessages.config";

/**
 * Error helper to ease error handling
 * @export ErrorHelper
 * @class ErrorHelper
 * @extends {Error}
 * @description Error helper
 *
 */
export class ErrorHelper extends Error {
  constructor(message: string, public code: number = 500) {
    super(message);
  }

  public static badRequest(
    message: string = ErrorMessageConfig.BAD_REQUEST.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.BAD_REQUEST.code);
  }

  public static notFound(
    message: string = ErrorMessageConfig.NOT_FOUND.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.NOT_FOUND.code);
  }

  public static forbidden(
    message: string = ErrorMessageConfig.FORBIDDEN.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.FORBIDDEN.code);
  }

  public static unauthorized(
    message: string = ErrorMessageConfig.UNAUTHORIZED.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.UNAUTHORIZED.code);
  }

  public static conflict(
    message: string = ErrorMessageConfig.CONFLICT.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.CONFLICT.code);
  }

  public static internal(
    message: string = ErrorMessageConfig.INTERNAL.message
  ) {
    return new ErrorHelper(message, ErrorMessageConfig.INTERNAL.code);
  }

  public static unknown(message: string = ErrorMessageConfig.INTERNAL.message) {
    return new ErrorHelper(message, ErrorMessageConfig.INTERNAL.code);
  }
}
