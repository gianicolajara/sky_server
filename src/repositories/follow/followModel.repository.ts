export abstract class followModelRepository {
  abstract follow(idFollower: string, idFollowed: string): Promise<void>;
  abstract unfollow(idFollower: string, idFollowed: string): Promise<void>;
}
