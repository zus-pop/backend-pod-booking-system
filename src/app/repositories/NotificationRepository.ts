import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Notification, Pagination } from "../types/type.ts";

const findByUserId = async (
    user_id: number,
    connection: PoolConnection,
    pagination?: Pagination
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];

    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM Notification";

    conditions.push(`?? = ?`);
    queryParams.push("user_id", user_id);

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    sql += ` ORDER BY ?? DESC`;
    queryParams.push("created_at");

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

    const columns = [
        "notification_id",
        "user_id",
        "message",
        "is_read",
        "created_at",
    ];
    const values = [columns, "Notification", ...queryParams];
    const [notifications] = await connection.query<RowDataPacket[]>(
        sql,
        values
    );
    return {
        notifications: notifications as Notification[],
        total: totalCount[0].total as number,
    };
};

const create = async (
    notification: Notification,
    connection: PoolConnection
): Promise<number> => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Notification", notification];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.insertId;
};

const markAsRead = async (
    notification: Notification,
    connection: PoolConnection
) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
    const values = [
        "Notification",
        notification,
        "notification_id",
        notification.notification_id,
        "user_id",
        notification.user_id,
    ];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.affectedRows;
};

export default {
    findByUserId,
    create,
    markAsRead,
};
