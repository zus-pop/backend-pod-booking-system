import { Router } from "express";
import CategoryController from "../../controllers/CategoryController.ts";

export const CategoryRouter = Router();

CategoryRouter.get("/", CategoryController.findAll);
CategoryRouter.get("/:id", CategoryController.findById);
