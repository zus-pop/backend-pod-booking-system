import { Router } from "express";
import UserController from "../../controllers/UserController.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";

export const UserRouter = Router();

// POST: api/v1/auth/login
UserRouter.post("/login", UserController.login);

// POST: api/v1/auth/register
UserRouter.post("/register", UserController.register);

// GET: api/v1/auth/users
UserRouter.get("/users", UserController.findAll);

// GET: api/v1/auth/user
UserRouter.get("/user", authenticateToken, UserController.getUser);

// POST: api/v1/auth/forgot-password
// POST: api/v1/auth/reset-password
