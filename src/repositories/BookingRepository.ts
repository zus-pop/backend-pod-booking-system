import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/pool.ts";
import { Booking } from "../types/type.ts";

const connection = await pool.getConnection();

const beginTransaction = async () => {
    await connection.beginTransaction();
};

const commit = async () => {
    await connection.commit();
};

const rollback = async () => {
    await connection.rollback();
};

const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "booking_id",
        "pod_id",
        "slot_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking"];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings as Booking[];
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "slot_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", "booking_id", id];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings[0] as Booking;
};

const findByTransactionId = async (transaction_id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "slot_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", "transaction_id", transaction_id];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings[0] as Booking;
};

const create = async (booking: Booking) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Booking", booking];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const update = async (booking: Booking) => {
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
    beginTransaction,
    commit,
    rollback,
    findAll,
    findById,
    findByTransactionId,
    create,
    update,
    // remove,
};
