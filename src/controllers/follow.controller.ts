import { SuccessMessageConfig } from "@config/successMessages.config";
import { ResponseHelper } from "@helpers/response.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { FollowModel } from "@models/follow.model";
import { FollowControllerRepository } from "@repositories/follow/followController.repository";
import { followSchema, followSchemaDelete } from "@schemas/follow.schema";
import { NextFunction, Request, Response } from "express";

export class FollowController extends FollowControllerRepository {
  constructor(private FollowModel: FollowModel) {
    super();
    this.FollowModel = FollowModel;
  }

  /**
   * Follow a user
   * @param req Request with the followed user and the current user IDs in the params
   * @param res Response to send the success message back to the user
   * @param next Next function to call if an error occurs
   * @returns A Promise that resolves if the follow is successful, or rejects if an error occurs
   */
  async follow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      //validate schema
      const {
        params: { followedId, followerId },
      } = ZodHelper.validateSchema(followSchema, req);

      //generate a follow
      await this.FollowModel.follow(followerId, followedId);

      //send response
      res
        .status(SuccessMessageConfig.FOLLOWCREATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.FOLLOWCREATED.message,
            null,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  async unfollow(
    /**
     * Unfollow a user
     * @param req Request with the followed user and the current user IDs in the params
     * @param res Response to send the success message back to the user
     * @param next Next function to call if an error occurs
     * @returns A Promise that resolves if the unfollow is successful, or rejects if an error occurs
     */
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //validate schema
      const {
        params: { followedId, followerId },
      } = ZodHelper.validateSchema(followSchemaDelete, req);

      //delete follow
      await this.FollowModel.unfollow(followerId, followedId);

      //send response
      res
        .status(SuccessMessageConfig.FOLLOWDELETED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.FOLLOWDELETED.message,
            null,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
