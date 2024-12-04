import { ServerProcess } from "@config/serverProcess.config";
import app from "./app";
import { ConsoleHelper } from "./helpers/console.helper";

const server = app.listen(
  ServerProcess.PORT,
  process.env.HOST || "localhost",
  () => {
    ConsoleHelper.log("🎉 App is running on PORT", ServerProcess.PORT);
  }
);

export const closeServer = () => {
  if (server) {
    server.close();
  }
};
