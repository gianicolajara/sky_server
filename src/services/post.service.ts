import { ErrorMessageConfig } from "@config/errorMessages.config";
import { ServerProcess } from "@config/serverProcess.config";
import { ErrorHelper } from "@helpers/errors.helper";
import { FilesHelper } from "@helpers/files.helper";
import prisma from "@helpers/prisma.helper";
import { SharpHelper } from "@helpers/sharp.helper";
import { UUIDHelper } from "@helpers/uuid.helper";
import { Post } from "@prisma/client";
import { PostModelRepository } from "@repositories/post/postModel.repository";
import { PostServiceRepository } from "@repositories/post/postService.repository";
import { PostMediaModelRepository } from "@repositories/postMedia/postMediaModel.repository";
import { UserModelRepository } from "@repositories/user/userModel.repository";

import path from "path";
import { CreatePostProp } from "src/types/types/post.type";
import { CreatePostMediaProp } from "src/types/types/postMedia.type";

export class PostService extends PostServiceRepository {
  constructor(
    private PostModel: PostModelRepository,
    private PostMediaModel: PostMediaModelRepository,
    private UserModel: UserModelRepository
  ) {
    super();
    this.PostModel = PostModel;
    this.PostMediaModel = PostMediaModel;
    this.UserModel = UserModel;
  }

  async createPost(
    post: CreatePostProp,
    files: Express.Multer.File[]
  ): Promise<Post> {
    await prisma.$connect();

    const { post: createdPost } = await prisma.$transaction(
      async (prismaTransaction) => {
        const createdPost = await this.PostModel.createPost(
          post,
          prismaTransaction
        );
        let postMedias: CreatePostMediaProp[] = [];

        if (files) {
          const newFiles: { [fieldname: string]: Express.Multer.File[] } = {};

          const filesAsync = Object.values(files).map(
            async (file: Express.Multer.File) => {
              const ext = file.originalname.split(".").pop();
              const filename = `${UUIDHelper.generate()}.${ext}`;
              const filePath = path.join(
                ServerProcess.POST_IMAGES_FOLDER,
                filename
              );

              await SharpHelper.lowerQuality(file.buffer, filePath);

              file.filename = filename;
              if (!newFiles[file.fieldname]) newFiles[file.fieldname] = [];
              newFiles[file.fieldname].push(file);
            }
          );

          const results = await Promise.allSettled(filesAsync);

          results.forEach((result, index) => {
            if (result.status === "rejected") {
              throw ErrorHelper.badRequest(
                `Error processing file ${files[index].originalname}: ${result.reason.message}`
              );
            }
          });

          Object.values(newFiles["postMedia"]).forEach(
            (file: Express.Multer.File) => {
              postMedias.push({
                id: UUIDHelper.generate(),
                postId: createdPost.id,
                path: file.filename,
              });
            }
          );
        }

        if (postMedias.length > 0) {
          await this.PostMediaModel.createPostMedia(
            postMedias,
            prismaTransaction
          );
        }

        return { post: createdPost };
      }
    );

    await prisma.$disconnect();

    return createdPost;
  }
  async deletePost(id: string): Promise<Post> {
    await prisma.$connect();

    const deletedPost = await prisma.$transaction(async (prismaTransaction) => {
      const postExists = await this.PostModel.getPostById(
        id,
        prismaTransaction
      );
      const postMedias = await this.PostMediaModel.getPostMediaByPostId(
        id,
        prisma
      );

      if (!postExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.POSTNOTEXIST.message);

      await this.PostMediaModel.deletePostMedia(
        postExists.id,
        prismaTransaction
      );
      const post = await this.PostModel.deletePost(
        postExists.id,
        prismaTransaction
      );

      const filesToDelete = postMedias.map((postMedia) =>
        path.resolve(ServerProcess.POST_IMAGES_FOLDER, postMedia.path)
      );

      await FilesHelper.deleteFiles(filesToDelete);

      return post;
    });

    await prisma.$disconnect();

    return deletedPost;
  }
  async updatePost(post: Partial<Post>, id: string): Promise<Post> {
    await prisma.$connect();

    const updatedPost = await prisma.$transaction(async (prismaTransaction) => {
      const postExists = await this.PostModel.getPostById(
        id,
        prismaTransaction
      );

      if (!postExists)
        throw ErrorHelper.notFound(ErrorMessageConfig.POSTNOTEXIST.message);

      const updatedPost = await this.PostModel.updatePost(
        {
          ...post,
          id: postExists.id,
        },
        prisma
      );

      return updatedPost;
    });

    await prisma.$disconnect();

    return updatedPost;
  }
  async getPostById(id: string): Promise<Post | null> {
    await prisma.$connect();

    const post = await prisma.$transaction(async (prismaTransaction) => {
      return await this.PostModel.getPostById(id, prismaTransaction);
    });

    await prisma.$disconnect();

    return post;
  }

  async getPostByUserFollow(
    id: string,
    limit: number,
    page: number
  ): Promise<Post[]> {
    await prisma.$connect();

    const posts = await prisma.$transaction(async (prismaTransaction) => {
      if (!id)
        throw ErrorHelper.badRequest(ErrorMessageConfig.INVALIDUSER.message);

      const usersId = await this.UserModel.getIdsFollowings(
        id,
        prismaTransaction
      );

      if (!usersId)
        throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

      return await this.PostModel.getPostByIds(
        id,
        usersId,
        limit,
        page,
        prismaTransaction
      );
    });

    await prisma.$disconnect();

    return posts;
  }

  async getPostByUser(
    sessionIdUser: string,
    id: string,
    limit: number,
    page: number
  ): Promise<Post[]> {
    await prisma.$connect();

    if (!id)
      throw ErrorHelper.notFound(ErrorMessageConfig.USERNOTEXIST.message);

    const posts = await this.PostModel.getPostByIds(
      sessionIdUser,
      id,
      limit,
      page,
      prisma
    );

    await prisma.$disconnect();
    return posts;
  }
}
