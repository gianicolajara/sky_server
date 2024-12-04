import { mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { fileExistsSync } from "tsconfig-paths/lib/filesystem";

export class FilesHelper {
  static createFolder(path: string) {
    if (!fileExistsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  static async deleteFile(path: string) {
    if (fileExistsSync(path)) {
      await unlink(path);
    }
  }

  static async deleteFiles(paths: string[]) {
    for (const path of paths) {
      await this.deleteFile(path);
    }
  }
}
