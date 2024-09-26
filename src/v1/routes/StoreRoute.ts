import StoreController from "../../controllers/StoreController.ts";
import { Router } from "express";

export const StoreRouter = Router();

// GET: api/v1/stores
StoreRouter.get("/", StoreController.findAll);

// GET: api/v1/stores/:id
StoreRouter.get("/:id", StoreController.findById);
