import { ErrorMessageConfig } from "@config/errorMessages.config";
import { ServerProcess } from "@config/serverProcess.config";
import { SuccessMessageConfig } from "@config/successMessages.config";
import { CryptoHelper } from "@helpers/crypto.helper";
import { ErrorHelper } from "@helpers/errors.helper";
import { FilesHelper } from "@helpers/files.helper";
import { ResponseHelper } from "@helpers/response.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { UserControllerRepository } from "@repositories/user/userController.repository";
import { UserModelRepository } from "@repositories/user/userModel.repository";
import {
  getUserByIdSchema,
  getUserIdByUsernameSchema,
  userAvatarUpdateSchema,
  userSchemaUpdate,
} from "@schemas/user.schema";
import { NextFunction, Request, Response } from "express";
import path from "path";

export class UserController extends UserControllerRepository {
  constructor(private UserModel: UserModelRepository) {
    super();
    this.UserModel = UserModel;
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        body: data,
        params: { id },
      } = ZodHelper.validateSchema(userSchemaUpdate, req);

      const userExists = await this.UserModel.findUserById(
        id,
        req.session.userId
      );

      if (!userExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      if (data.password)
        data.password = await CryptoHelper.hashPassword(data.password);

      await this.UserModel.updateUser(data);

      const userUpdated = await this.UserModel.updateUser(data);

      res
        .status(SuccessMessageConfig.USERUPDATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.USERUPDATED.message,
            userUpdated,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
      } = ZodHelper.validateSchema(getUserByIdSchema, req);

      const user = await this.UserModel.findUserById(id, req.session.userId);

      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      res
        .status(SuccessMessageConfig.USERFOUND.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.USERFOUND.message,
            user,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }

  async changeAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
      } = ZodHelper.validateSchema(userAvatarUpdateSchema, req);

      const userExists = await this.UserModel.findUserById(id);

      if (!userExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      if (userExists.avatar) {
        await FilesHelper.deleteFile(
          path.resolve(ServerProcess.AVATAR_FOLDER, userExists.avatar)
        );
      }

      const file = req.file;

      if (!file)
        throw ErrorHelper.badRequest(ErrorMessageConfig.FILENOTEXIST.message);

      await this.UserModel.updateUser({
        id,
        avatar: `uploads/avatar/${file.filename}`,
      });

      res
        .status(SuccessMessageConfig.USERUPDATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.USERUPDATED.message,
            userExists,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }

  async getUserIdByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { username },
      } = ZodHelper.validateSchema(getUserIdByUsernameSchema, req);

      const userData = await this.UserModel.findUserIdByUsername(username);

      res
        .status(SuccessMessageConfig.USERFOUND.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.USERFOUND.message,
            userData,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
