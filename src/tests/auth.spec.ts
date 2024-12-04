import { faker } from "@faker-js/faker";
import prisma from "@helpers/prisma.helper";
import { Comment, Post, User } from "@prisma/client";
import path from "path";
import request from "supertest";
import app, { sessionStore } from "../app";
import { closeServer } from "../index";

const baseUrl = "/v1";
const authUrl = `${baseUrl}/auth`;
const userUrl = `${baseUrl}/user`;
const postUrl = `${baseUrl}/post`;
const commentUrl = `${baseUrl}/comment`;
const likeUrl = `${baseUrl}/likePost`;
const followUrl = `${baseUrl}/follow`;

const req = request(app);
const testImage = path.resolve("src", "assets", "testing", "flask.png");

let tokenRes: { status: number; body: any; headers: any };
let resLogin: { status: number; body: any; headers: any };

const fakeUser = {
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: "Fernando123#1",
  name: faker.person.firstName(),
  lastname: faker.person.lastName(),
  isPremium: false,
  registrationDate: new Date().toISOString(),
};

const secondfakeUser = {
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: "Fernando123#1",
  name: faker.person.firstName(),
  lastname: faker.person.lastName(),
  isPremium: false,
  registrationDate: new Date().toISOString(),
};

let userGenerated: User;
let userGenerated2: User;
let postGenerated: Post;
let commentGenerated: Comment;

describe("Auth Routes", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Register User", async () => {
    const resRegister = await req
      .post(`${authUrl}/register`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", tokenRes.headers["set-cookie"])
      .send(fakeUser);

    userGenerated = resRegister.body.data;

    const resRegister2 = await req
      .post(`${authUrl}/register`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", tokenRes.headers["set-cookie"])
      .send(secondfakeUser);

    userGenerated2 = resRegister.body.data;

    expect(resRegister.status).toBe(201);
    expect(resRegister2.status).toBe(201);
  });

  it("Login User", async () => {
    resLogin = await req
      .post(`${authUrl}/login`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", tokenRes.headers["set-cookie"])
      .send({ email: fakeUser.email, password: fakeUser.password });

    expect(resLogin.status).toBe(200);
  });
});

describe("User Routes", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Get User", async () => {
    const user = await req
      .get(`${userUrl}/getById/${userGenerated.id}`)
      .set("Cookie", resLogin.headers["set-cookie"])
      .send();

    expect(user.status).toBe(200);
  });

  it("Updated User", async () => {
    const user = await req
      .put(`${userUrl}/update/${userGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send({ name: "Fernando", id: userGenerated.id });

    expect(user.status).toBe(200);
    expect(user.body.data.name).toBe("Fernando");
  });

  it("Updated Avatar User", async () => {
    const userUpdatedRes = await req
      .put(`${userUrl}/changeAvatar/${userGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .attach("avatar", testImage, {
        contentType: "image/png",
      });

    expect(userUpdatedRes.status).toBe(200);

    const userRes = await req
      .get(`${userUrl}/getById/${userGenerated.id}`)
      .set("Cookie", resLogin.headers["set-cookie"])
      .send();

    expect(userRes.status).toBe(200);
    expect(userRes.body.data.avatar).not.toBe(null);
  });
});

describe("Posts", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Create Post", async () => {
    const postResponse = await req
      .post(`${postUrl}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .attach("postMedia", testImage, {
        contentType: "image/png",
      })
      .field({
        title: "Test Post",
        content: "Test Post Description",
        authorId: userGenerated.id,
      });

    postGenerated = postResponse.body.data;

    expect(postResponse.status).toBe(201);
  });

  it("Get Post By Id", async () => {
    const getPostByIdResponse = await req
      .get(`${postUrl}/${postGenerated.id}`)
      .set("Cookie", resLogin.headers["set-cookie"])
      .send();

    expect(getPostByIdResponse.status).toBe(200);
    expect(getPostByIdResponse.body.data.id).toBe(postGenerated.id);
  });

  it("Update Post By Id", async () => {
    const updatePostResponse = await req
      .put(`${postUrl}/${postGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send({
        title: "Test Post Updated",
        content: "Test Post Description Updated",
      });

    expect(updatePostResponse.status).toBe(200);

    const getPostByIdResponse = await req
      .get(`${postUrl}/${postGenerated.id}`)
      .set("Cookie", resLogin.headers["set-cookie"])
      .send();

    expect(getPostByIdResponse.status).toBe(200);
    expect(getPostByIdResponse.body.data.title).toBe("Test Post Updated");
  });
});

describe("comment", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Create Comment", async () => {
    const commentResponse = await req
      .post(`${commentUrl}/${postGenerated.id}/${userGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send({
        content: "Test Comment in post",
      });

    commentGenerated = commentResponse.body.data;

    expect(commentResponse.status).toBe(201);
  });

  it("Delete Comment By Id", async () => {
    const deleteCommentResponse = await req
      .delete(`${commentUrl}/${commentGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(deleteCommentResponse.status).toBe(200);
  });
});

describe("Likes", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Like post", async () => {
    const likePostResponse = await req
      .post(`${likeUrl}/like/${userGenerated.id}/${postGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(likePostResponse.status).toBe(201);
  });

  it("unlike post", async () => {
    const unlikePostResponse = await req
      .delete(`${likeUrl}/unlike/${userGenerated.id}/${postGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(unlikePostResponse.status).toBe(200);
  });
});

describe("Follow", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Follow create", async () => {
    const followResponse = await req
      .post(`${followUrl}/${userGenerated.id}/${userGenerated2.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(followResponse.status).toBe(201);
  });

  it("Unfollow create", async () => {
    const unfollowResponse = await req
      .delete(`${followUrl}/${userGenerated.id}/${userGenerated2.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(unfollowResponse.status).toBe(200);
  });
});

describe("Delete leftover tables", () => {
  beforeAll(async () => {
    tokenRes = await req.get("/v1/auth/csrfToken");
    expect(tokenRes.status).toBe(200);
  });

  it("Delete Post", async () => {
    const deletePostResponse = await req
      .delete(`${postUrl}/${postGenerated.id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        tokenRes.headers["set-cookie"],
        resLogin.headers["set-cookie"],
      ])
      .send();

    expect(deletePostResponse.status).toBe(200);
  });

  it("Logout User", async () => {
    const resLogout = await req
      .post(`${authUrl}/logout`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("X-CSRF-Token", tokenRes.body.csrfToken)
      .set("Cookie", [
        resLogin.headers["set-cookie"],
        tokenRes.headers["set-cookie"],
      ])
      .send();

    expect(resLogout.status).toBe(200);
  });

  afterAll(async () => {
    await prisma.$disconnect();

    await prisma.$transaction(async (prisma) => {
      await prisma.likePost.deleteMany({});
      await prisma.follow.deleteMany({});
      await prisma.comment.deleteMany({});
      await prisma.postMedia.deleteMany({});
      await prisma.post.deleteMany({});
      await prisma.user.deleteMany({});
    });

    await prisma.$disconnect();
    sessionStore.close();

    closeServer();
  });
});
