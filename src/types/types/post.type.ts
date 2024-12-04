import { Post } from "@prisma/client";

export type PostWithoutId = Omit<Post, "id">;
export type PartialPostWithId = Partial<Post> & Required<Pick<Post, "id">>;
export type CreatePostProp = Omit<Post, "createdAt" | "updatedAt">;
