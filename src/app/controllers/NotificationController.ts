import { Request, Response } from "express";
import NotificationService from "../services/NotificationService.ts";

const findByUserId = async (req: Request, res: Response) => {
    const { payload } = req;
    const { page, limit } = req.query;
    const user_id = payload.user_id as number;
    const result = await NotificationService.findByUserId(user_id, {
        page: page ? +page : 1,
        limit: limit ? +limit : 8,
    });
    if (!result || !result.notifications || !result.notifications.length) {
        return res.status(404).json({ message: "Notifications not found" });
    }
    return res.status(200).json(result);
};

export default {
    findByUserId,
};
