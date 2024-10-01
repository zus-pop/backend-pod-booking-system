import { Router } from "express";
import UtilityController from "../../controllers/UtilityController.ts";

export const UtilityRouter = Router();

UtilityRouter.get("/", UtilityController.findAll);
UtilityRouter.get("/:id", UtilityController.findById);
