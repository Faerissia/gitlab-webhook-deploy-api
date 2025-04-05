import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";

import { discordClient } from "./config/discord";

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user?.tag}!`);
});

discordClient.login(process.env.DISCORD_TOKEN);

const app: Application = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}!`);
});

app.use("/", router);

export default app;
