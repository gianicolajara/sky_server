import prisma from "@helpers/prisma.helper";
import { PostMedia, Prisma } from "@prisma/client";
import { PostMediaModelRepository } from "@repositories/postMedia/postMediaModel.repository";
import { CreatePostMediaProp } from "src/types/types/postMedia.type";
import { PrismaTransaction } from "src/types/types/prisma.type";

export class PostMediaModel extends PostMediaModelRepository {
  async createPostMedia(
    postMedia: CreatePostMediaProp[],
    PrismaTransaction: PrismaTransaction
  ): Promise<Prisma.BatchPayload> {
    return PrismaTransaction.postMedia.createMany({
      data: postMedia,
    });
  }

  async deletePostMedia(postId: string): Promise<Prisma.BatchPayload> {
    return prisma.postMedia.deleteMany({
      where: {
        postId: postId,
      },
    });
  }

  async getPostMediaByPostId(
    postId: string,
    PrismaTransaction: PrismaTransaction
  ): Promise<PostMedia[]> {
    return PrismaTransaction.postMedia.findMany({
      where: {
        postId: postId,
      },
    });
  }
}
