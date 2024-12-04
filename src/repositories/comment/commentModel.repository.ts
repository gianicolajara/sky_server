import { Comment } from "@prisma/client";
import { CreateCommentProp } from "src/types/types/comment.type";

export abstract class CommentModelRepository {
  abstract createComment(comment: CreateCommentProp): Promise<Comment>;
  abstract deleteComment(id: string): Promise<Comment>;
}
