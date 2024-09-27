import { ResultSetHeader, RowDataPacket } from "mysql2";
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
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments as Payment[];
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
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
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
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
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
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
};

const create = async (payment: Payment) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Payment", payment];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const update = async (payment: Payment) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Payment", payment, "payment_id", payment.payment_id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    findAll,
    findById,
    findByBookingId,
    findByTransactionId,
    create,
    update,
};
