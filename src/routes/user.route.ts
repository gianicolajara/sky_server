import { ServerProcess } from "@config/serverProcess.config";
import { UserController } from "@controllers/user.controller";
import { AuthGuard } from "@middlewares/authGuard.middleware";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { UploadFileMiddleware } from "@middlewares/uploadFile.middleware";
import { UserControllerRepository } from "@repositories/user/userController.repository";
import { UserModelRepository } from "@repositories/user/userModel.repository";
import { NextFunction, Request, Response, Router } from "express";

export class UserRoute {
  private UserModel: UserModelRepository;
  private Controller: UserControllerRepository;
  private route = Router();

  constructor(UserModel: UserModelRepository) {
    this.UserModel = UserModel;
    this.Controller = new UserController(this.UserModel);
  }

  generateRoutes() {
    this.route.put(
      "/update/:id",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.update.bind(this.Controller)
    );

    this.route.get(
      "/getUserIdByUsername/:username",
      this.Controller.getUserIdByUsername.bind(this.Controller)
    );

    this.route.get(
      "/getById/:id",
      [AuthGuard.isAuthenticated],
      this.Controller.getById.bind(this.Controller)
    );

    this.route.put(
      "/changeAvatar/:id",
      [
        AuthGuard.isAuthenticated,
        CsrfMiddleware.csrf.doubleCsrfProtection,
        (req: Request, res: Response, next: NextFunction) =>
          UploadFileMiddleware.uploadFile(
            ServerProcess.AVATAR_FOLDER,
            "avatar",
            req,
            res,
            next
          ),
      ],
      this.Controller.changeAvatar.bind(this.Controller)
    );

    return this.route;
  }
}
