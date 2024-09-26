import PODTypeController from "../../controllers/PODTypeController.ts";
import { Router } from "express";

export const PODTypeRouter = Router();

// GET: api/v1/pod-types
PODTypeRouter.get("/", PODTypeController.findAll);

// GET: api/v1/pod-types/:id
PODTypeRouter.get("/:id", PODTypeController.findById);
