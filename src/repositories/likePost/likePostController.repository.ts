import { NextFunction, Request, Response } from "express";

export abstract class LikePostControllerRepository {
  abstract likePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract unlikePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
