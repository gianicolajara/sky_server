import { z } from "zod";

export const likePostSchema = z.object({
  params: z.object({
    postId: z.string({}).min(1, { message: "The post is required" }),
    authorId: z.string({}).min(1, { message: "The author is required" }),
  }),
});

export const likePostSchemaDelete = z.object({
  params: z.object({
    postId: z.string({}).min(1, { message: "The post is required" }),
    authorId: z.string({}).min(1, { message: "The author is required" }),
  }),
});
