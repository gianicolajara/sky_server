import { Post } from "@prisma/client";
import { PostPopulated } from "src/types/prisma/post";
import { CreatePostProp, PartialPostWithId } from "src/types/types/post.type";
import { PrismaTransaction } from "src/types/types/prisma.type";

export abstract class PostModelRepository {
  abstract getPostById(
    id: string,
    prisma: PrismaTransaction
  ): Promise<Post | null>;
  abstract createPost(
    post: CreatePostProp,
    prisma: PrismaTransaction
  ): Promise<Post>;
  abstract updatePost(
    post: PartialPostWithId,
    prisma: PrismaTransaction
  ): Promise<Post>;
  abstract deletePost(id: string, prisma: PrismaTransaction): Promise<Post>;
  abstract getPostByIds(
    idUser: string,
    idsFollowing: string[] | string,
    limit: number,
    page: number,
    prisma: PrismaTransaction
  ): Promise<PostPopulated[]>;
}
