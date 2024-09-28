import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Booking } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking"];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings as Booking[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", "booking_id", id];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings[0] as Booking;
};

const findByTransactionId = async (transaction_id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", "transaction_id", transaction_id];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings[0] as Booking;
};

const create = async (booking: Booking, connection: PoolConnection) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Booking", booking];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const update = async (booking: Booking, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Booking", booking, "booking_id", booking.booking_id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

// const remove = async (id: number) => {
//     try {
//         const sql = "DELETE FROM ?? WHERE ?? = ?";
//         const values = ["Booking", "booking_id", id];
//         const [result] = await connection.query<ResultSetHeader>(sql, values);
//         return result.affectedRows;
//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// };

export default {
    findAll,
    findById,
    findByTransactionId,
    create,
    update,
    // remove,
};
