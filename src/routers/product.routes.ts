import { Router } from "express";

const ProductRouter = Router();

ProductRouter.get("/product/health", (req_, res) => res.send("OK"));

export { ProductRouter };
