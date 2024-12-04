import { Follow, Prisma } from "@prisma/client";

const userInclude = {
  _count: {
    select: {
      followers: true,
      following: true,
    },
  },
  following: true,
} satisfies Prisma.UserInclude;

export type UserPopulatedWithoutPassword = Omit<
  Prisma.UserGetPayload<{ include: typeof userInclude }>,
  "password"
> & { _count: { followers: number; following: number }; following: Follow[] };
