import { pool } from "../config/pool.ts";
import { Payment } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment"];
    const [payments] = await connection.query<Payment[]>(sql, values);
    return payments;
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "payment_id", id];
    const [payments] = await connection.query<Payment[]>(sql, values);
    return payments[0];
};

const findByBookingId = async (booking_id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "booking_id", booking_id];
    const [payments] = await connection.query<Payment[]>(sql, values);
    return payments[0];
};

const findByTransactionId = async (transaction_id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "transaction_id", transaction_id];
    const [payments] = await connection.query<Payment[]>(sql, values);
    return payments[0];
};

export default {
    findAll,
    findById,
    findByBookingId,
    findByTransactionId
}
