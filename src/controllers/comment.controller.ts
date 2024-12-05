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

  /**
   * Create a new comment on a post
   * @param req Request with the new comment data in the body, and the post and author IDs in the params
   * @param res Response to send the new comment back to the user
   * @param next Next function to call if an error occurs
   */
  async createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //validate schema
      const {
        body: data,
        params: { postId, authorId },
      } = ZodHelper.validateSchema(commentSchema, req);

      //generate unique id
      const id = UUIDHelper.generate();

      //create new comment
      const newComment = await this.CommentModel.createComment({
        id,
        postId: postId,
        authorId: authorId,
        ...data,
      });

      //send response
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
  /**
   * Deletes a comment
   * @param req Request to delete the comment
   * @param res Response to send the deleted comment back to the user
   * @param next Next function to call if an error occurs
   */
  async deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //validate schema
      const {
        params: { id },
      } = ZodHelper.validateSchema(commentSchemaDelete, req);

      //delete comment by id
      const deletedComment = await this.CommentModel.deleteComment(id);

      //send response
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
