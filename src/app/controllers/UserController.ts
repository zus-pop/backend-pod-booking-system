import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService.ts";
import { Roles } from "../types/type.ts";

const find = async (_: Request, res: Response) => {
    const users = await UserService.findAll();
    if (!users) {
        return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
};

const findByUsernameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { search } = req.query;
    if (!search) return next();
    const users = await UserService.findByUsernameOrEmail(search as string);
    if (!users || !users.length) {
        return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserService.findByEmail(email);
    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }
    const isValidPassword = await UserService.comparePassword(
        password,
        user.password
    );
    if (!isValidPassword) {
        return res.status(403).json({ message: "Password is not correct!" });
    }
    const payload = {
        user_id: user.user_id,
    };
    const token = UserService.generateToken(payload);
    return res.status(200).json({ token, message: "Login successfully!" });
};

const register = async (req: Request, res: Response) => {
    const { user_name, email, password } = req.body;
    const user = await UserService.findByEmail(email);
    if (user) {
        return res.status(400).json({ message: "Email already exists!" });
    }
    const hashedPassword = await UserService.hashPassword(password);
    const newUser = {
        email,
        password: hashedPassword,
        user_name,
        role_id: Roles.Customer,
    };
    const result = await UserService.persist(newUser);
    if (!result) {
        return res.status(500).json({ message: "Failed to create user!" });
    }
    res.status(201).json({
        message: "Created user successfully!",
    });
};

const getUser = async (req: Request, res: Response) => {
    const { payload } = req;
    const user = await UserService.findById(payload.user_id);
    res.status(200).json(user);
};

export default {
    find,
    findByUsernameOrEmail,
    login,
    register,
    getUser,
};
