import { NextFunction, Request, Response } from "express";

export abstract class PostControllerRepository {
  abstract getPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract getPostByUserFollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract getPostByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
