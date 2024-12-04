import prisma from "@helpers/prisma.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { followModelRepository } from "@repositories/follow/followModel.repository";

export class FollowModel extends followModelRepository {
  async follow(idFollower: string, idFollowed: string): Promise<void> {
    await prisma.$connect();

    const id = UUIDHelper.generate();

    await prisma.follow.create({
      data: {
        id,
        followedId: idFollowed,
        followerId: idFollower,
      },
    });

    await prisma.$disconnect();
  }
  async unfollow(idFollower: string, idFollowed: string): Promise<void> {
    await prisma.$connect();

    await prisma.follow.delete({
      where: {
        follower_following_unique: {
          followedId: idFollowed,
          followerId: idFollower,
        },
      },
    });

    await prisma.$disconnect();
  }
}
