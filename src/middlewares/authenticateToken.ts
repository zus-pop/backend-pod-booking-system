import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService.ts";

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    const user = UserService.verifyToken(token);
    if (!user) {
        return res.status(403).json({ message: "Invalid token!" });
    }
    req.user = user;
    next();
};
