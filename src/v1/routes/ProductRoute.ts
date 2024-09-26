import { Router } from "express";
import ProductController from "../../controllers/ProductController.ts";

export const ProductRouter = Router();

ProductRouter.get("/", ProductController.findAll);
ProductRouter.get("/:id", ProductController.findById);
