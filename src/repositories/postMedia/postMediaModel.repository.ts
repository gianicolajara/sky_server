import { PostMedia, Prisma } from "@prisma/client";
import { CreatePostMediaProp } from "src/types/types/postMedia.type";
import { PrismaTransaction } from "src/types/types/prisma.type";

export abstract class PostMediaModelRepository {
  abstract createPostMedia(
    postMedia: CreatePostMediaProp[],
    prisma: PrismaTransaction
  ): Promise<Prisma.BatchPayload>;
  abstract deletePostMedia(
    postId: string,
    prisma: PrismaTransaction
  ): Promise<Prisma.BatchPayload>;
  abstract getPostMediaByPostId(
    postId: string,
    prisma: PrismaTransaction
  ): Promise<PostMedia[]>;
}
