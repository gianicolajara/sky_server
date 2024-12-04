import { FollowController } from "@controllers/follow.controller";
import { AuthGuard } from "@middlewares/authGuard.middleware";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { FollowModel } from "@models/follow.model";
import { FollowControllerRepository } from "@repositories/follow/followController.repository";
import { Router } from "express";

export class FollowRoute {
  private Controller: FollowControllerRepository;
  private route = Router();

  constructor(private FollowModel: FollowModel) {
    this.FollowModel = FollowModel;
    this.Controller = new FollowController(this.FollowModel);
  }

  generateRoutes() {
    this.route.post(
      "/:followedId/:followerId",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.follow.bind(this.Controller)
    );

    this.route.delete(
      "/:followedId/:followerId",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.unfollow.bind(this.Controller)
    );

    return this.route;
  }
}
