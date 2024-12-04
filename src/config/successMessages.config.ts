export class SuccessMessageConfig {
  static POSTOFOUND = this.generatorMessage("Post found", 200);
  static POSTCREATED = this.generatorMessage("Post created", 201);
  static POSTUPDATED = this.generatorMessage("Post updated", 200);
  static POSTDELETED = this.generatorMessage("Post deleted", 200);
  static USERCREATED = this.generatorMessage("User created", 201);
  static USERUPDATED = this.generatorMessage("User updated", 200);
  static USERDELETED = this.generatorMessage("User deleted", 200);
  static USERFOUND = this.generatorMessage("User found", 200);
  static COMMENTCREATED = this.generatorMessage("Comment created", 201);
  static COMMENTDELETED = this.generatorMessage("Comment deleted", 200);
  static LIKEPOSTCREATED = this.generatorMessage("Like created", 201);
  static LIKEPOSTDELETED = this.generatorMessage("Like deleted", 200);
  static FOLLOWCREATED = this.generatorMessage("Follow created", 201);
  static FOLLOWDELETED = this.generatorMessage("Follow deleted", 200);

  static generatorMessage(message: string, code: number) {
    return { message, code };
  }
}
