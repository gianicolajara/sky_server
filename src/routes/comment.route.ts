import { CommentController } from "@controllers/comment.controller";
import { CommentControllerRepository } from "@repositories/comment/commentController.repository";
import { CommentModelRepository } from "@repositories/comment/commentModel.repository";
import { Router } from "express";

export class CommentRoute {
  private route = Router();
  private Controller: CommentControllerRepository;
  constructor(private CommentModel: CommentModelRepository) {
    this.CommentModel = CommentModel;
    this.Controller = new CommentController(this.CommentModel);
  }

  generateRoutes() {
    this.route.post(
      "/:postId/:authorId",
      this.Controller.createComment.bind(this.Controller)
    );
    this.route.delete(
      "/:id",
      this.Controller.deleteComment.bind(this.Controller)
    );
    return this.route;
  }
}
