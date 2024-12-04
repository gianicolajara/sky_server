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

  async follow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { followedId, followerId },
      } = ZodHelper.validateSchema(followSchema, req);

      await this.FollowModel.follow(followerId, followedId);

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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { followedId, followerId },
      } = ZodHelper.validateSchema(followSchemaDelete, req);

      await this.FollowModel.unfollow(followerId, followedId);

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
