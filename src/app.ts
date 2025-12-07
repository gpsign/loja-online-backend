import cors from "cors";
import express from "express";
import { globalErrorHandler } from "middlewares";
import { AuthRouter, PrivateRouter, UserRouter } from "routers";

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
