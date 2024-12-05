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

  /**
   *
   * @description hadle login for user by email and password
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   *
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      //getting email and password
      const {
        body: { email, password },
      } = ZodHelper.validateSchema(authSchema, req);

      //check if user exist
      const user = await this.userModel.findUserByEmail(email);

      //if user not exist
      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      //compare password hash
      const passUnhash = await CryptoHelper.comparePassword(
        password,
        user.password
      );

      //if password not match
      if (!passUnhash)
        throw ErrorHelper.unauthorized(
          ErrorMessageConfig.WRONGPASSWORD.message
        );

      //generate token with user id
      const jwt = JwtHelper.generateToken({ id: user.id });

      //save token in session
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

          //send response
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
  /**
   * @description hadle register new user
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   *
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //validate data from request
      const { body: data } = ZodHelper.validateSchema(authSchemaRegister, req);

      //check if user already exist
      const userExists = await this.userModel.findUserByEmail(data.email);

      //if user already exist
      if (userExists)
        throw ErrorHelper.conflict(ErrorMessageConfig.USERALREADYEXIST.message);

      //generate unique id
      const id = UUIDHelper.generate();
      //create hash password
      data.password = await CryptoHelper.hashPassword(data.password);

      //create new user
      const newUser: CreateUserProp = {
        id,
        ...data,
      };

      //create user in database
      const createdUser = await this.userModel.createUser(newUser);

      res
        .status(201)
        .json(ResponseHelper.success("User created", createdUser, req));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Logout for user
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   *
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      //delete session
      req.session.userId = undefined;
      req.session.jwt = undefined;

      //save session without information
      req.session.save((err) => {
        if (err) next(err);

        //delete session and detroy cookies in frontend
        req.session.destroy((err) => {
          if (err) next(err);

          res.clearCookie("sky_session", {
            path: "/",
            domain: process.env.DOMAIN,
          });

          res
            .status(200)
            .json(ResponseHelper.success("Logout successful", {}, req));
        });
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Generates a CSRF token and sends it in the response.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
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

  /**
   * @description Checks if a user is authenticated and returns the user object if it is.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async checkAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //get user id from session
      const idUser = req.session.userId;

      //if user is not authenticated
      if (!idUser)
        throw ErrorHelper.unauthorized(ErrorMessageConfig.UNAUTHORIZED.message);

      //find user by id
      const user = await this.userModel.findUserById(idUser);

      //if user not exist
      if (!user)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      //send response
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
