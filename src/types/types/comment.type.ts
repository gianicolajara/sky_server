import { Comment } from "@prisma/client";

export type CreateCommentProp = Omit<Comment, "createdAt" | "updatedAt">;
