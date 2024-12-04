import { Post } from "@prisma/client";
import { CreatePostProp } from "src/types/types/post.type";

export abstract class PostServiceRepository {
  abstract createPost(
    post: CreatePostProp,
    files: Express.Multer.File[]
  ): Promise<Post>;
  abstract deletePost(id: string): Promise<Post>;
  abstract updatePost(post: Partial<Post>, id: string): Promise<Post>;
  abstract getPostById(id: string): Promise<Post | null>;

  abstract getPostByUserFollow(
    id: string,
    limit: number,
    page: number
  ): Promise<Post[]>;

  abstract getPostByUser(
    sessionIdUser: string,
    id: string,
    limit: number,
    page: number
  ): Promise<Post[]>;
}
