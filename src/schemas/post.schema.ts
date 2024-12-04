import { z } from "zod";

export const postSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: "The title is not valid",
        required_error: "The title is required",
      })
      .min(3, { message: "The title must be at least 3 characters" }),
    content: z
      .string({
        invalid_type_error: "The content is not valid",
        required_error: "The content is required",
      })
      .min(3, { message: "The content must be at least 3 characters" }),
    authorId: z.string({}).min(1, { message: "The authorId is required" }),
    postMedia: z.array(z.string()).optional(),
  }),
});

export const postUpdateSchema = z.object({
  params: z.object({
    id: z.string({}),
  }),
  body: z.object({
    title: z
      .string({
        invalid_type_error: "The title is not valid",
        required_error: "The title is required",
      })
      .min(3, { message: "The title must be at least 3 characters" })
      .optional(),
    content: z
      .string({
        invalid_type_error: "The content is not valid",
        required_error: "The content is required",
      })
      .min(3, { message: "The content must be at least 3 characters" })
      .optional(),
    postMedia: z.array(z.any()).optional(),
  }),
});

export const postSchemaDelete = z.object({
  params: z.object({
    id: z.string({}),
  }),
});

export const postGetByIdSchema = z.object({
  params: z.object({
    id: z.string({}),
  }),
});

export const getPostByFollowingSchema = z.object({
  query: z.object({
    page: z.string({}).optional(),
    limit: z.string({}).optional(),
  }),
});

export const getPostByUserSchema = z.object({
  query: z.object({
    page: z.string({}).optional(),
    limit: z.string({}).optional(),
  }),
  params: z.object({
    id: z.string({}),
  }),
});
