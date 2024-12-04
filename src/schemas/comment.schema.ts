import { z } from "zod";

export const commentSchema = z.object({
  params: z.object({
    postId: z.string({}).min(1, { message: "The post is required" }),
    authorId: z.string({}).min(1, { message: "The author is required" }),
  }),
  body: z.object({
    content: z
      .string({
        invalid_type_error: "The content is not valid",
        required_error: "The content is required",
      })
      .min(3, { message: "The content must be at least 3 characters" }),
  }),
});

export const commentSchemaDelete = z.object({
  params: z.object({
    id: z.string({}),
  }),
});
