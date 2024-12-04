import prisma from "@helpers/prisma.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { LikePost } from "@prisma/client";
import { LikePostModelRepository } from "@repositories/likePost/likePostModel.repository";

export class LikePostModel extends LikePostModelRepository {
  async likePost(idPost: string, idUser: string): Promise<LikePost | null> {
    await prisma.$connect();

    const id = UUIDHelper.generate();

    const likedata = await prisma.likePost.create({
      data: {
        id,
        authorId: idUser,
        postId: idPost,
      },
    });

    await prisma.$disconnect();

    return likedata;
  }
  async unlikePost(idUser: string, idPost: string): Promise<LikePost | null> {
    await prisma.$connect();

    const likedata = await prisma.likePost.delete({
      where: {
        author_post_unique: {
          authorId: idUser,
          postId: idPost,
        },
      },
    });

    await await prisma.$disconnect();

    return likedata;
  }
}
