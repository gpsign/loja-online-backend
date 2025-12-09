import cors from "cors";
import express from "express";
import { globalErrorHandler } from "middlewares";
import { AuthRouter, PrivateRouter, UserRouter } from "routers";

const app = express();

app
  .use(express.urlencoded({ limit: "50mb" }))
  .use(express.json({ limit: "50mb" }))
  .set("trust proxy", true)
  .use(cors())
  .get("/health", (_r, res) => res.send("OK"))
  .use(AuthRouter)
  .use(UserRouter)
  .use(PrivateRouter)
  .use(globalErrorHandler);

export default app;
