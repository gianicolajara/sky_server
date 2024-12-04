import { LikePostController } from "@controllers/likePost.controller";
import { AuthGuard } from "@middlewares/authGuard.middleware";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { LikePostModel } from "@models/likePost.model";
import { LikePostControllerRepository } from "@repositories/likePost/likePostController.repository";
import { Router } from "express";

export class LikeRoute {
  private Controller: LikePostControllerRepository;
  private route = Router();

  constructor(private LikePostModel: LikePostModel) {
    this.LikePostModel = LikePostModel;
    this.Controller = new LikePostController(this.LikePostModel);
  }

  generateRoutes() {
    this.route.post(
      "/like/:authorId/:postId",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.likePost.bind(this.Controller)
    );

    this.route.delete(
      "/unlike/:authorId/:postId",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.unlikePost.bind(this.Controller)
    );

    return this.route;
  }
}
