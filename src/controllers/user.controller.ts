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

  /**
   * Update a user by id
   * @param req Request containing the user data in the body, and the user id in the params
   * @param res Response to send the updated user back to the user
   * @param next Next function to call if an error occurs
   * @throws {Error} if the user does not exist
   * @throws {Error} if the password is not valid
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate schema
      const {
        body: data,
        params: { id },
      } = ZodHelper.validateSchema(userSchemaUpdate, req);

      // update user
      const userExists = await this.UserModel.findUserById(
        id,
        req.session.userId
      );

      // if user not exist
      if (!userExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      // if password is not valid
      if (data.password)
        data.password = await CryptoHelper.hashPassword(data.password);

      // update user
      const userUpdated = await this.UserModel.updateUser(data);

      // send response
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

  /**
   * Get a user by id
   * @param req Request with the user id in the params
   * @param res Response to send the user back to the user
   * @param next Next function to call if an error occurs
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        params: { id },
      } = ZodHelper.validateSchema(getUserByIdSchema, req);

      // get user by id
      const user = await this.UserModel.findUserById(id, req.session.userId);

      // if user not exist throw error
      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      // send response
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

  /**
   * Update the avatar of a user
   * @param req Request with the user id in the params and the avatar file in the body
   * @param res Response to send the success message back to the user
   * @param next Next function to call if an error occurs
   */
  async changeAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        params: { id },
      } = ZodHelper.validateSchema(userAvatarUpdateSchema, req);

      // validate if user exists
      const userExists = await this.UserModel.findUserById(id);

      // if user not exist
      if (!userExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      // delete old avatar
      if (userExists.avatar) {
        await FilesHelper.deleteFile(
          path.resolve(ServerProcess.AVATAR_FOLDER, userExists.avatar)
        );
      }

      // get new file
      const file = req.file;

      // if file not exist
      if (!file)
        throw ErrorHelper.badRequest(ErrorMessageConfig.FILENOTEXIST.message);

      // update user avatar
      await this.UserModel.updateUser({
        id,
        avatar: `uploads/avatar/${file.filename}`,
      });

      // send response
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

  /**
   * Get the id of a user by username
   * @param req Request with the username in the params
   * @param res Response to send the user id back to the user
   * @param next Next function to call if an error occurs
   */
  async getUserIdByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        params: { username },
      } = ZodHelper.validateSchema(getUserIdByUsernameSchema, req);

      // get user id by username
      const userData = await this.UserModel.findUserIdByUsername(username);

      // if user not exist throw error
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
