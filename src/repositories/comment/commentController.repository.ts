import { NextFunction, Request, Response } from "express";

export abstract class CommentControllerRepository {
  abstract createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
