import { pool } from "../config/pool.ts";
import NotificationRepo from "../repositories/NotificationRepository.ts";
import { Notification, Pagination } from "../types/type.ts";
import { sendNotification } from "../utils/socket-stuffs.ts";

const findByUserId = async (user_id: number, pagination?: Pagination) => {
    const connection = await pool.getConnection();
    try {
        const result = await NotificationRepo.findByUserId(
            user_id,
            connection,
            pagination
        );
        return result;
    } catch (err) {
        console.error(err);
        return null; // or throw err
    } finally {
        connection.release();
    }
};

const createNewMessage = async (notification: Notification) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await NotificationRepo.create(notification, connection);
        if (result) {
            sendNotification(notification.user_id!, notification.message!);
        }
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const markAsRead = async (notification: Notification) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await NotificationRepo.markAsRead(
            notification,
            connection
        );
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findByUserId,
    createNewMessage,
    markAsRead,
};
