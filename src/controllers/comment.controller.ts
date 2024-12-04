import { SuccessMessageConfig } from "@config/successMessages.config";
import { ResponseHelper } from "@helpers/response.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { CommentControllerRepository } from "@repositories/comment/commentController.repository";
import { CommentModelRepository } from "@repositories/comment/commentModel.repository";
import { commentSchema, commentSchemaDelete } from "@schemas/comment.schema";
import { NextFunction, Request, Response } from "express";

export class CommentController extends CommentControllerRepository {
  constructor(private CommentModel: CommentModelRepository) {
    super();
    this.CommentModel = CommentModel;
  }

  async createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        body: data,
        params: { postId, authorId },
      } = ZodHelper.validateSchema(commentSchema, req);

      const id = UUIDHelper.generate();

      const newComment = await this.CommentModel.createComment({
        id,
        postId: postId,
        authorId: authorId,
        ...data,
      });

      res
        .status(SuccessMessageConfig.COMMENTCREATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.COMMENTCREATED.message,
            newComment,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  async deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
      } = ZodHelper.validateSchema(commentSchemaDelete, req);

      const deletedComment = await this.CommentModel.deleteComment(id);

      res
        .status(SuccessMessageConfig.COMMENTDELETED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.COMMENTDELETED.message,
            deletedComment,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
