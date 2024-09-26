import { ResultSetHeader } from "mysql2";
import { pool } from "../config/pool.ts";
import { Booking } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
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
        const [bookings] = await connection.query<Booking[]>(sql, values);
        return bookings;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findById = async (id: number) => {
    try {
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
        const [bookings] = await connection.query<Booking[]>(sql, values);
        return bookings[0];
    } catch (err) {
        console.error(err);
        return null;
    }
};

const create = async (booking: Booking) => {
    try {
        const sql = "INSERT INTO ?? SET ?";
        const values = ["Booking", booking];
        const [result] = await connection.query<ResultSetHeader>(sql, values);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const update = async (booking: Booking) => {
    try {
        const sql = "UPDATE ?? SET ? WHERE ?? = ?";
        const values = ["Booking", booking, "booking_id", booking.booking_id];
        const [result] = await connection.query<ResultSetHeader>(sql, values);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
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
    create,
    update,
    // remove,
};
