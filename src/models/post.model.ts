import { Post } from "@prisma/client";
import { PostModelRepository } from "@repositories/post/postModel.repository";
import { PostPopulated } from "src/types/prisma/post";
import { CreatePostProp, PartialPostWithId } from "src/types/types/post.type";
import { PrismaTransaction } from "src/types/types/prisma.type";

export class PostModel extends PostModelRepository {
  async getPostById(
    id: string,
    prisma: PrismaTransaction
  ): Promise<Post | null> {
    return prisma.post.findUnique({
      where: {
        id,
      },
    });
  }
  async createPost(
    post: CreatePostProp,
    prisma: PrismaTransaction
  ): Promise<Post> {
    return prisma.post.create({
      data: post,
    });
  }

  async updatePost(
    post: PartialPostWithId,
    prisma: PrismaTransaction
  ): Promise<Post> {
    return prisma.post.update({
      where: {
        id: post.id,
      },
      data: post,
    });
  }
  async deletePost(id: string, prisma: PrismaTransaction): Promise<Post> {
    return prisma.post.delete({
      where: {
        id,
      },
    });
  }

  async getPostByIds(
    idUser: string,
    idsFollowing: string[] | string,
    limit: number,
    page: number,
    prisma: PrismaTransaction
  ): Promise<PostPopulated[]> {
    return prisma.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        author: {
          id: {
            in: Array.isArray(idsFollowing)
              ? [...idsFollowing, idUser]
              : [idsFollowing],
          },
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: true,
        authorId: true,
        postMedia: true,
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          select: {
            authorId: true,
            id: true,
            postId: true,
          },

          where: {
            authorId: idUser,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
