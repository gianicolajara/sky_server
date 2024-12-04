import { User } from "@prisma/client";
import { UserPopulatedWithoutPassword } from "src/types/prisma/user";
import { PrismaTransaction } from "src/types/types/prisma.type";
import {
  CreateUserProp,
  PartialUsertWithId,
  UserWithoutPassword,
} from "src/types/types/user.type";

export abstract class UserModelRepository {
  abstract findUserById(
    id: string,
    sessionUserId?: string
  ): Promise<UserPopulatedWithoutPassword | null>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract createUser(user: CreateUserProp): Promise<User>;
  abstract updateUser(user: PartialUsertWithId): Promise<UserWithoutPassword>;
  abstract getIdsFollowings(
    id: string,
    prisma: PrismaTransaction
  ): Promise<string[] | null>;

  abstract findUserIdByUsername(username: string): Promise<
    | {
        id: string;
        username: string;
      }[]
    | null
  >;
}
