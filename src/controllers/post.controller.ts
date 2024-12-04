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

  async getPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
      } = ZodHelper.validateSchema(postGetByIdSchema, req);

      const post = await this.PostService.getPostById(id);

      if (!post)
        throw ErrorHelper.notFound(ErrorMessageConfig.POSTNOTEXIST.message);

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
  async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body: data } = ZodHelper.validateSchema(postSchema, req);

      const id = UUIDHelper.generate();

      const newPost: CreatePostProp = { ...data, id };

      const createdPost = await this.PostService.createPost(
        newPost,
        req.files as Express.Multer.File[]
      );

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
  async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        body: data,
        params: { id },
      } = ZodHelper.validateSchema(postUpdateSchema, req);

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
  async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
      } = ZodHelper.validateSchema(postSchemaDelete, req);

      const deletedPost = await this.PostService.deletePost(id);

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

  async getPostByUserFollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        query: { limit, page },
      } = ZodHelper.validateSchema(getPostByFollowingSchema, req);

      if (!req.session.userId)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      const posts = await this.PostService.getPostByUserFollow(
        req.session.userId as string,
        Number(limit),
        Number(page)
      );

      const nextPage = posts.length === Number(limit) ? Number(page) + 1 : null;

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

  async getPostByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        query: { limit, page },
        params: { id },
      } = ZodHelper.validateSchema(getPostByUserSchema, req);

      if (!id)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      const posts = await this.PostService.getPostByUser(
        req.session.userId as string,
        id as string,
        Number(limit),
        Number(page)
      );

      const nextPage = posts.length === Number(limit) ? Number(page) + 1 : null;

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
