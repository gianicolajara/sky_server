import prisma from "@helpers/prisma.helper";
import { Comment } from "@prisma/client";
import { CommentModelRepository } from "@repositories/comment/commentModel.repository";
import { CreateCommentProp } from "src/types/types/comment.type";

export class CommentModel extends CommentModelRepository {
  async createComment(comment: CreateCommentProp): Promise<Comment> {
    await prisma.$connect();

    const newComment = await prisma.comment.create({
      data: comment,
    });

    await prisma.$disconnect();

    return newComment;
  }
  async deleteComment(id: string): Promise<Comment> {
    await prisma.$connect();

    const deletedComment = await prisma.comment.delete({
      where: { id },
    });

    await prisma.$disconnect();

    return deletedComment;
  }
}
