import { ErrorMessageConfig } from "@config/errorMessages.config";
import { ErrorHelper } from "@helpers/errors.helper";
import { FilesHelper } from "@helpers/files.helper";
import { SharpHelper } from "@helpers/sharp.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { NextFunction, Request, Response } from "express";
import { mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { fileExistsSync } from "tsconfig-paths/lib/filesystem";

export class UploadFileMiddleware {
  /**
   * Uploads a file to the specified destination
   *
   * @param {string} dest - The destination folder to upload the file to
   * @param {string} field - The field name to upload the file as
   * @param {Request} req - The express request object
   * @param {Response} res - The express response object
   * @param {NextFunction} next - The express next function
   */
  static async uploadFile(
    dest: string,
    field: string,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    FilesHelper.createFolder(dest);

    const upload = multer({
      dest: dest,
      limits: { fileSize: 1000000, files: 1 },

      fileFilter(_, file, callback) {
        const fileMimeAccepted = ["image/jpeg", "image/png"];

        if (fileMimeAccepted.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            ErrorHelper.badRequest(ErrorMessageConfig.FILEMUSTBEAIMAGE.message)
          );
        }
      },
      storage: multer.memoryStorage(),
    }).single(field);

    upload(req, res, async (err) => {
      if (err) {
        next(err);
        return;
      }

      try {
        if (req.file) {
          const ext = req.file?.originalname.split(".").pop();

          const filename = `${UUIDHelper.generate()}.${ext}`;
          const saveTo = path.resolve("src", "public", "uploads", field);
          const filePath = path.join(saveTo, filename);

          await SharpHelper.lowerQuality(req.file.buffer, filePath);

          req.file.filename = filename;
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  }

  /**
   * Uploads multiple files to the given destination folder
   * @param dest Destination folder
   * @param field Field name in the form
   * @param req Express request
   * @param res Express response
   * @param next Express next callback
   */
  static async uploadFiles(
    dest: string,
    field: string,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!fileExistsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const upload = multer({
      dest: dest,
      limits: { fileSize: 1000000, files: 3 },

      fileFilter(_, file, callback) {
        const fileMimeAccepted = ["image/jpeg", "image/png"];

        if (fileMimeAccepted.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            ErrorHelper.badRequest(ErrorMessageConfig.FILEMUSTBEAIMAGE.message)
          );
        }
      },
      storage: multer.memoryStorage(),
    }).array(field, 3);

    upload(req, res, async (err) => {
      if (err) {
        next(err);
        return;
      }

      next();
    });
  }
}
