import { Router } from "express";
import UserController from "../../controllers/UserController.ts";

export const UserRouter = Router();

// POST: api/v1/auth/login
UserRouter.post("/login", UserController.login);

// POST: api/v1/auth/register
UserRouter.post("/register", UserController.register);

// POST: api/v1/auth/forgot-password
// POST: api/v1/auth/reset-password
