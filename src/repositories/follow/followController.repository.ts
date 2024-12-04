import { NextFunction, Request, Response } from "express";

export abstract class FollowControllerRepository {
  abstract follow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract unfollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
