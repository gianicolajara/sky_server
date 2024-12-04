import { LikePost, PostMedia, Prisma, User } from "@prisma/client";

const postInclude = {
  postMedia: true,
  author: true,
  likes: true,
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostPopulated = Prisma.PostGetPayload<{
  include: typeof postInclude;
}> & {
  postMedia: PostMedia[];
  author: User;
  likes: LikePost[];
  _count: { likes: number };
};
