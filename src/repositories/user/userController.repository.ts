import { NextFunction, Request, Response } from "express";

export abstract class UserControllerRepository {
  abstract update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract changeAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract getUserIdByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
