import { NextFunction, Request, Response } from "express";

/**
 * Abstract class for authentication repository
 * @abstract AuthRepository
 * @exports AuthRepository
 */
export abstract class AuthControllerRepository {
  abstract login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  abstract register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract csrfToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  abstract checkAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
