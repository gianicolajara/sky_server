import { SuccessMessageConfig } from "@config/successMessages.config";
import { ResponseHelper } from "@helpers/response.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { LikePostControllerRepository } from "@repositories/likePost/likePostController.repository";
import { LikePostModelRepository } from "@repositories/likePost/likePostModel.repository";
import { likePostSchema, likePostSchemaDelete } from "@schemas/like.schema";
import { NextFunction, Request, Response } from "express";

export class LikePostController extends LikePostControllerRepository {
  constructor(private LikePostModel: LikePostModelRepository) {
    super();
    this.LikePostModel = LikePostModel;
  }

  async likePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { authorId, postId },
      } = ZodHelper.validateSchema(likePostSchema, req);

      const likeRes = await this.LikePostModel.likePost(postId, authorId);

      res
        .status(SuccessMessageConfig.LIKEPOSTCREATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.LIKEPOSTCREATED.message,
            likeRes,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  async unlikePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { authorId, postId },
      } = ZodHelper.validateSchema(likePostSchemaDelete, req);

      const unlikeRes = await this.LikePostModel.unlikePost(authorId, postId);

      res
        .status(SuccessMessageConfig.LIKEPOSTDELETED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.LIKEPOSTDELETED.message,
            unlikeRes,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
