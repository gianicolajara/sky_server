import { ServerProcess } from "@config/serverProcess.config";
import { PostController } from "@controllers/post.controller";
import { AuthGuard } from "@middlewares/authGuard.middleware";
import { CsrfMiddleware } from "@middlewares/csrf.middleware";
import { UploadFileMiddleware } from "@middlewares/uploadFile.middleware";
import { PostControllerRepository } from "@repositories/post/postController.repository";
import { PostService } from "@services/post.service";
import { NextFunction, Request, Response, Router } from "express";

export class PostRoute {
  private route = Router();
  private Controller: PostControllerRepository;

  constructor(private PostService: PostService) {
    this.PostService = PostService;
    this.Controller = new PostController(this.PostService);
  }

  generateRoutes() {
    this.route.get(
      "/getByUser/:id",
      this.Controller.getPostByUser.bind(this.Controller)
    );

    this.route.get(
      "/getByUserFollowed",
      this.Controller.getPostByUserFollow.bind(this.Controller)
    );

    this.route.get(
      "/:id",
      [AuthGuard.isAuthenticated],
      this.Controller.getPostById.bind(this.Controller)
    );

    this.route.post(
      "/",
      [
        AuthGuard.isAuthenticated,
        CsrfMiddleware.csrf.doubleCsrfProtection,
        (req: Request, res: Response, next: NextFunction) => {
          return UploadFileMiddleware.uploadFiles(
            ServerProcess.POST_IMAGES_FOLDER,
            "postMedia",
            req,
            res,
            next
          );
        },
      ],
      this.Controller.createPost.bind(this.Controller)
    );

    this.route.put(
      "/:id",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.updatePost.bind(this.Controller)
    );

    this.route.delete(
      "/:id",
      [AuthGuard.isAuthenticated, CsrfMiddleware.csrf.doubleCsrfProtection],
      this.Controller.deletePost.bind(this.Controller)
    );

    return this.route;
  }
}
