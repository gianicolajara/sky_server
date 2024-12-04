import { AuthController } from "@controllers/auth.controller";
import { AuthGuard } from "@middlewares/authGuard.middleware";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { AuthControllerRepository } from "@repositories/auth/authController.repository";
import { UserModelRepository } from "@repositories/user/userModel.repository";
import { Router } from "express";

export class AuthRoute {
  private UserModel: UserModelRepository;
  private Controller: AuthControllerRepository;
  private route = Router();

  constructor(UserModel: UserModelRepository) {
    this.UserModel = UserModel;
    this.Controller = new AuthController(this.UserModel);
  }

  generateRoutes() {
    this.route.post(
      "/login",
      [CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.login.bind(this.Controller)
    );
    this.route.post(
      "/register",
      [CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.register.bind(this.Controller)
    );

    this.route.post(
      "/logout",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.logout.bind(this.Controller)
    );

    this.route.get(
      "/csrfToken",
      this.Controller.csrfToken.bind(this.Controller)
    );

    this.route.get(
      "/checkAuth",
      [AuthGuard.isAuthenticated],
      this.Controller.checkAuth.bind(this.Controller)
    );

    return this.route;
  }
}
