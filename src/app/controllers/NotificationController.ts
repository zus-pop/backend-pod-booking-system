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

const markAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { payload } = req;
    const result = await NotificationService.markAsRead({
        user_id: payload.user_id,
        notification_id: +id,
        is_read: true,
    });
    if (!result) {
        return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(201).json({ message: "Mark as read successfully" });
};

export default {
    findByUserId,
    markAsRead,
};
