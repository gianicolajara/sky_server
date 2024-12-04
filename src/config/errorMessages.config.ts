export class ErrorMessageConfig {
  public static BAD_REQUEST = this.generatorMessage("Bad request", 400);
  public static NOT_FOUND = this.generatorMessage("Not found", 404);
  public static FORBIDDEN = this.generatorMessage("Forbidden", 403);
  public static UNAUTHORIZED = this.generatorMessage("Unauthorized", 401);
  public static CONFLICT = this.generatorMessage("Conflict", 409);
  public static INTERNAL = this.generatorMessage("Internal", 500);
  public static USERALREADYEXIST = this.generatorMessage(
    "User already exist",
    409
  );

  public static WRONGPASSWORD = this.generatorMessage("Wrong password", 401);

  public static USERNOTEXIST = this.generatorMessage("User not exist", 404);
  public static POSTNOTEXIST = this.generatorMessage("Post not exist", 404);

  public static FILENOTEXIST = this.generatorMessage("File not exist", 404);
  public static FILEMUSTBEAIMAGE = this.generatorMessage(
    "File must be image",
    404
  );

  public static JUSTJPG = this.generatorMessage("Just jpg is allowed", 400);
  public static JUST1MB = this.generatorMessage("Just 1MB is allowed", 400);

  public static INVALIDUSER = this.generatorMessage("Invalid user", 400);

  static generatorMessage(message: string, code: number) {
    return { message, code };
  }
}
