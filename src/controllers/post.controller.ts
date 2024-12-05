import { ErrorMessageConfig } from "@config/errorMessages.config";
import { SuccessMessageConfig } from "@config/successMessages.config";
import { ErrorHelper } from "@helpers/errors.helper";
import { ResponseHelper } from "@helpers/response.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { PostControllerRepository } from "@repositories/post/postController.repository";
import { PostServiceRepository } from "@repositories/post/postService.repository";
import {
  getPostByFollowingSchema,
  getPostByUserSchema,
  postGetByIdSchema,
  postSchema,
  postSchemaDelete,
  postUpdateSchema,
} from "@schemas/post.schema";

import { NextFunction, Request, Response } from "express";

import { CreatePostProp } from "src/types/types/post.type";

export class PostController extends PostControllerRepository {
  constructor(private PostService: PostServiceRepository) {
    super();
    this.PostService = PostService;
  }

  /**
   * Get a post by its id
   * @param req Request with the post id in the params
   * @param res Response to send the post back to the user
   * @param next Next function to call if an error occurs
   * @throws {ErrorHelper} if the post does not exist
   */
  async getPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // get the post id from the params
      const {
        params: { id },
      } = ZodHelper.validateSchema(postGetByIdSchema, req);

      // get the post
      const post = await this.PostService.getPostById(id);

      // throw an error if the post does not exist
      if (!post)
        throw ErrorHelper.notFound(ErrorMessageConfig.POSTNOTEXIST.message);

      // send the post
      res
        .status(SuccessMessageConfig.POSTOFOUND.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTOFOUND.message,
            post,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Create a new post
   * @param req Request containing the post data in the body, and the files in the request
   * @param res Response to send the newly created post back to the user
   * @param next Next function to call if an error occurs
   */
  async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const { body: data } = ZodHelper.validateSchema(postSchema, req);

      // generate unique id
      const id = UUIDHelper.generate();

      // generate a new post
      const newPost: CreatePostProp = { ...data, id };

      // create post
      const createdPost = await this.PostService.createPost(
        newPost,
        req.files as Express.Multer.File[]
      );

      // send response
      res
        .status(SuccessMessageConfig.POSTCREATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTCREATED.message,
            createdPost,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Update a post
   * @param req Request containing the post data in the body, and the post id in the params
   * @param res Response to send the updated post back to the user
   * @param next Next function to call if an error occurs
   */
  async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        body: data,
        params: { id },
      } = ZodHelper.validateSchema(postUpdateSchema, req);

      // update post
      const updatedPost = await this.PostService.updatePost(data, id);

      res
        .status(SuccessMessageConfig.POSTUPDATED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTUPDATED.message,
            updatedPost,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Delete a post by id
   * @param req Request containing the post id in the params
   * @param res Response to send the deleted post back to the user
   * @param next Next function to call if an error occurs
   */
  async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        params: { id },
      } = ZodHelper.validateSchema(postSchemaDelete, req);

      // delete post by id
      const deletedPost = await this.PostService.deletePost(id);

      // send response
      res
        .status(SuccessMessageConfig.POSTDELETED.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTDELETED.message,
            deletedPost,
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get posts by users followed by the current user
   * @param req Request with optional limit and page in the query
   * @param res Response to send the posts and next page information back to the user
   * @param next Next function to call if an error occurs
   * @throws {ErrorHelper} if the user is not authorized
   */
  async getPostByUserFollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        query: { limit, page },
      } = ZodHelper.validateSchema(getPostByFollowingSchema, req);

      //if the user is not authorized generate error
      if (!req.session.userId)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      // get the posts
      const posts = await this.PostService.getPostByUserFollow(
        req.session.userId as string,
        Number(limit),
        Number(page)
      );

      // calculate next page
      const nextPage = posts.length === Number(limit) ? Number(page) + 1 : null;

      // send response
      res
        .status(SuccessMessageConfig.POSTOFOUND.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTOFOUND.message,
            { posts, nextPage },
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get posts by user
   * @param req Request with the user id in the params and optional limit and page in the query
   * @param res Response to send the posts and next page information back to the user
   * @param next Next function to call if an error occurs
   */
  async getPostByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // validate schema
      const {
        query: { limit, page },
        params: { id },
      } = ZodHelper.validateSchema(getPostByUserSchema, req);

      //if the user is not authorized generate error
      if (!id)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      // get the posts paginated
      const posts = await this.PostService.getPostByUser(
        req.session.userId as string,
        id as string,
        Number(limit),
        Number(page)
      );

      // calculate next page
      const nextPage = posts.length === Number(limit) ? Number(page) + 1 : null;

      // send response
      res
        .status(SuccessMessageConfig.POSTOFOUND.code)
        .json(
          ResponseHelper.success(
            SuccessMessageConfig.POSTOFOUND.message,
            { posts, nextPage },
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
