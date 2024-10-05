import { Request, Response } from "express";
import UserService from "../services/UserService.ts";
import { Roles } from "../types/type.ts";
import { calendar, oauth2Client, scopes } from "../utils/google-calendar.ts";
import { calendar_v3 } from "googleapis";

const findAll = async (_: Request, res: Response) => {
    const users = await UserService.findAll();
    if (!users) {
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

const authenticateCalendar = (req: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
    res.redirect(url);
};

const calendarRedirect = async (req: Request, res: Response) => {
    const { tokens } = await oauth2Client.getToken(req.query.code as string);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! Please return to the website");
};

const syncCalendar = async (req: Request, res: Response) => {
    const { payload } = req;
    console.log(payload);
    const event: calendar_v3.Schema$Event = {
        summary: "Event from API",
        description: "Event from API",
        start: {
            dateTime: "2024-11-01T00:00:00.000",
            timeZone: "Asia/Ho_Chi_Minh",
        },
        end: {
            dateTime: "2024-11-01T01:00:00.000",
            timeZone: "Asia/Ho_Chi_Minh",
        },
    };
    try {
        const result = await calendar.events.insert({
            calendarId: "primary",
            auth: oauth2Client,
            requestBody: event,
        });
        res.status(200).json({ message: "Event created", result });
    } catch (err) {
        console.error(err);
        console.log("here");
        res.status(500).json({ message: "Failed to sync calendar!" });
    }
};

export default {
    findAll,
    login,
    register,
    getUser,
    authenticateCalendar,
    calendarRedirect,
    syncCalendar,
};
