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

  /**
   * Like a post
   * @param req Request with the author and post IDs in the params
   * @param res Response to send the new like back to the user
   * @param next Next function to call if an error occurs
   */
  async likePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      ///validate schema
      const {
        params: { authorId, postId },
      } = ZodHelper.validateSchema(likePostSchema, req);

      //generate like in a post
      const likeRes = await this.LikePostModel.likePost(postId, authorId);

      //send response
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
  /**
   * Unlike a post
   * @param req Request with the author and post IDs in the params
   * @param res Response to send the deleted like back to the user
   * @param next Next function to call if an error occurs
   */
  async unlikePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //validate schema
      const {
        params: { authorId, postId },
      } = ZodHelper.validateSchema(likePostSchemaDelete, req);

      //delete like
      const unlikeRes = await this.LikePostModel.unlikePost(authorId, postId);

      //send response
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
