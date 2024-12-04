import { User } from "@prisma/client";

export type UserWithoutId = Omit<User, "id">;
export type PartialUsertWithId = Partial<User> & Required<Pick<User, "id">>;
export type CreateUserProp = Omit<
  User,
  "registrationDate" | "avatar" | "isPremium"
>;

export type UserWithoutPassword = Omit<User, "password">;
