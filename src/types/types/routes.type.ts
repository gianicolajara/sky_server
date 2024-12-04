import { NextFunction, Request, Response } from "express";

export type RouteEntry = {
  method: string;
  path: string;
  handler: (req: Request, res: Response, next: NextFunction) => any;
};
