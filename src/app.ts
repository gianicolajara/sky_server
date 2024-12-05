import { ServerProcess } from "@config/serverProcess.config";
import { SessionConfig } from "@config/session.config";
import { ConsoleHelper } from "@helpers/console.helper";
import { HandlingErrorHelper } from "@helpers/handlingError.herlper";
import { UrlHelper } from "@helpers/url.helper";
import { CommentModel } from "@models/comment.model";
import { FollowModel } from "@models/follow.model";
import { LikePostModel } from "@models/likePost.model";
import { PostModel } from "@models/post.model";
import { PostMediaModel } from "@models/postMedia.model";
import { UserModel } from "@models/user.model";
import { AuthRoute } from "@routes/auth.route";
import { CommentRoute } from "@routes/comment.route";
import { FollowRoute } from "@routes/follow.route";
import { LikeRoute } from "@routes/like.route";
import { PostRoute } from "@routes/post.route";
import { UserRoute } from "@routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import MySQLStoreClassFactory from "express-mysql-session";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { PostService } from "./services/post.service";

ServerProcess.init();

const app = express();

const MySQLSessionStore = MySQLStoreClassFactory(session as any);
const sessionStore = new MySQLSessionStore(
  SessionConfig.generateSessionStore()
);

let sess: session.SessionOptions = SessionConfig.init(sessionStore);

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  app.set("trust proxy", true);
}

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(session(sess));
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

//statics
app.use(express.static(path.resolve("src", "public")));

app.get("/", (_, res: Response) => {
  res.json({
    message: "Welcome to Sky Api",
    version: "1.0.0",
    env: app.get("env"),
    author: "Gianicola Jara",
  });
});

app.use((req, _, next) => {
  ConsoleHelper.log({
    headers: req.headers,
    cookies: req.cookies,
  });

  next();
});

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "auth"),
  new AuthRoute(new UserModel()).generateRoutes()
);

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "user"),
  new UserRoute(new UserModel()).generateRoutes()
);

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "post"),
  new PostRoute(
    new PostService(new PostModel(), new PostMediaModel(), new UserModel())
  ).generateRoutes()
);

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "comment"),
  new CommentRoute(new CommentModel()).generateRoutes()
);

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "likePost"),
  new LikeRoute(new LikePostModel()).generateRoutes()
);

app.use(
  UrlHelper.generateVersionUrl(ServerProcess.VERSION_NAME, "follow"),
  new FollowRoute(new FollowModel()).generateRoutes()
);

app.use(HandlingErrorHelper.errorHandler);

app.all("*", (_: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

export { sessionStore };
