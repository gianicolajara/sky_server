import prisma from "@helpers/prisma.helper";
import { User } from "@prisma/client";
import { UserModelRepository } from "@repositories/user/userModel.repository";
import { UserPopulatedWithoutPassword } from "src/types/prisma/user";
import { PrismaTransaction } from "src/types/types/prisma.type";

import {
  PartialUsertWithId,
  UserWithoutPassword,
} from "src/types/types/user.type";

export class UserModel extends UserModelRepository {
  async findUserById(
    id: string,
    sessionUserId?: string
  ): Promise<UserPopulatedWithoutPassword | null> {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        avatar: true,
        isPremium: true,
        registrationDate: true,
        username: true,
        password: false,
        //is friend of session user
        following: {
          select: {
            id: true,
            followedId: true,
            followerId: true,
          },
          where: {
            followerId: sessionUserId,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    await prisma.$disconnect();

    return user;
  }
  async findUserByEmail(email: string): Promise<User | null> {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    await prisma.$disconnect();

    return user;
  }
  async createUser(user: User): Promise<User> {
    await prisma.$connect();

    const newUser = await prisma.user.create({
      data: user,
    });

    await prisma.$disconnect();

    return newUser;
  }
  async updateUser(user: PartialUsertWithId): Promise<UserWithoutPassword> {
    await prisma.$connect();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        avatar: true,
        isPremium: true,
        registrationDate: true,
        username: true,
        password: false,
      },
    });

    await prisma.$disconnect();

    return updatedUser;
  }

  async getIdsFollowings(
    id: string,
    PrismaTransaction: PrismaTransaction
  ): Promise<string[] | null> {
    const ids = await PrismaTransaction.user
      .findUnique({
        where: {
          id,
        },
      })
      .followers({ select: { followedId: true } });

    const idsMapped = ids?.map((id) => id.followedId) ?? null;

    return idsMapped;
  }

  async findUserIdByUsername(username: string): Promise<
    | {
        id: string;
        username: string;
      }[]
    | null
  > {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        username: true,
        id: true,
      },
      take: 5,
    });

    return users;
  }
}
