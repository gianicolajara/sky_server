import { z } from "zod";

export const followSchema = z.object({
  params: z.object({
    followerId: z.string({}).min(1, { message: "The post is required" }),
    followedId: z.string({}).min(1, { message: "The author is required" }),
  }),
});

export const followSchemaDelete = z.object({
  params: z.object({
    followerId: z.string({}).min(1, { message: "The post is required" }),
    followedId: z.string({}).min(1, { message: "The author is required" }),
  }),
});
