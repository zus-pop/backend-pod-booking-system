import { Router } from "express";
import RoleController from "../../controllers/RoleController.ts";

export const RoleRouter = Router();

// GET: api/v1/roles
RoleRouter.get("/", RoleController.findAll);

// GET: api/v1/roles/:id
RoleRouter.get("/:id", RoleController.findById);
