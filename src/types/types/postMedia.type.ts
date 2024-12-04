import { PostMedia } from "@prisma/client";

export type CreatePostMediaProp = Omit<PostMedia, "createdAt" | "updatedAt">;
