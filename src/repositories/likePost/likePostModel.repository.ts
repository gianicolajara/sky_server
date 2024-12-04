import { LikePost } from "@prisma/client";

export abstract class LikePostModelRepository {
  abstract likePost(idPost: string, idUser: string): Promise<LikePost | null>;
  abstract unlikePost(idPost: string, idUser: string): Promise<LikePost | null>;
}
