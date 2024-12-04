import { ErrorMessageConfig } from "@config/errorMessages.config";
import { CryptoHelper } from "@helpers/crypto.helper";
import { ErrorHelper } from "@helpers/errors.helper";
import { JwtHelper } from "@helpers/jwt.helper";
import { ResponseHelper } from "@helpers/response.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { ZodHelper } from "@helpers/zod.helper";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { AuthControllerRepository } from "@repositories/auth/authController.repository";
import { UserModelRepository } from "@repositories/user/userModel.repository";
import { authSchema, authSchemaRegister } from "@schemas/auth.schema";

import { NextFunction, Request, Response } from "express";

import { CreateUserProp } from "src/types/types/user.type";

export class AuthController extends AuthControllerRepository {
  public userModel: UserModelRepository;
  private csrf = CsrfMiddleware.csrf;

  constructor(userModel: UserModelRepository) {
    super();
    this.userModel = userModel;
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        body: { email, password },
      } = ZodHelper.validateSchema(authSchema, req);

      const user = await this.userModel.findUserByEmail(email);

      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      const passUnhash = await CryptoHelper.comparePassword(
        password,
        user.password
      );

      if (!passUnhash)
        throw ErrorHelper.unauthorized(
          ErrorMessageConfig.WRONGPASSWORD.message
        );

      const jwt = JwtHelper.generateToken({ id: user.id });

      req.session.regenerate((err) => {
        if (err) next(err);

        req.session.userId = user.id;
        req.session.jwt = jwt;

        req.session.save((err) => {
          if (err) next(err);

          const userWithoutPassword = {
            ...user,
            password: undefined,
          };

          res
            .status(200)
            .json(
              ResponseHelper.success(
                "Login successful",
                { user: userWithoutPassword },
                req
              )
            );
        });
      });
    } catch (error) {
      next(error);
    }
  }
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body: data } = ZodHelper.validateSchema(authSchemaRegister, req);

      const userExists = await this.userModel.findUserByEmail(data.email);

      if (userExists)
        throw ErrorHelper.conflict(ErrorMessageConfig.USERALREADYEXIST.message);

      const id = UUIDHelper.generate();
      data.password = await CryptoHelper.hashPassword(data.password);

      const newUser: CreateUserProp = {
        id,
        ...data,
      };

      const createdUser = await this.userModel.createUser(newUser);

      res
        .status(201)
        .json(ResponseHelper.success("User created", createdUser, req));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.session.userId = undefined;
      req.session.jwt = undefined;

      req.session.save((err) => {
        if (err) next(err);

        req.session.destroy((err) => {
          if (err) next(err);

          //clear cookies
          res.clearCookie("sky_session");

          res
            .status(200)
            .json(ResponseHelper.success("Logout successful", {}, req));
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async csrfToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = this.csrf.generateToken(req, res);

      res.status(200).json({ csrfToken: token });
    } catch (error) {
      next(error);
    }
  }

  async checkAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idUser = req.session.userId;

      if (!idUser)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      const user = await this.userModel.findUserById(idUser);

      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      const userWithoutPassword = {
        ...user,
        password: undefined,
      };

      res
        .status(200)
        .json(
          ResponseHelper.success(
            "Login successful",
            { user: userWithoutPassword },
            req
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
