import { globalErrorHandler } from "middlewares";
import cors from "cors";
import express from "express";
import { AuthRouter, UserRouter } from "routers";
import { PrivateRouter } from "routers/private.routes";

const app = express();

app
  .set("trust proxy", true)
  .use(cors())
  .use(express.json())
  .get("/health", (_r, res) => res.send("OK"))
  .use(AuthRouter)
  .use(UserRouter)
  .use(PrivateRouter)
  .use(globalErrorHandler);

export default app;
