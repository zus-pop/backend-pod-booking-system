import { Router } from "express";
import PODController from "../../controllers/PODController.ts";

export const PODRouter = Router();

// GET: api/v1/pods
PODRouter.get("/", PODController.findAll);

// GET: api/v1/pods/:id
PODRouter.get("/:id", PODController.findById);
