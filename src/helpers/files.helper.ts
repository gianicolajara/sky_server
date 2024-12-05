import { mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { fileExistsSync } from "tsconfig-paths/lib/filesystem";

export class FilesHelper {
  /**
   * Creates a folder if it does not exist.
   * @param path The path to the folder to create.
   */
  static createFolder(path: string) {
    if (!fileExistsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  /**
   * Deletes a file at the specified path if it exists.
   * @param path The path to the file to delete.
   * @returns A promise that resolves when the file is successfully deleted.
   */
  static async deleteFile(path: string) {
    if (fileExistsSync(path)) {
      await unlink(path);
    }
  }

  /**
   * Deletes multiple files at the specified paths if they exist.
   * @param paths The paths to the files to delete.
   * @returns A promise that resolves when all files are successfully deleted.
   */
  static async deleteFiles(paths: string[]) {
    for (const path of paths) {
      await this.deleteFile(path);
    }
  }
}
