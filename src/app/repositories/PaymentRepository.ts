import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Pagination, Payment, PaymentQueries } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";

const find = async (
    filters: PaymentQueries,
    connection: PoolConnection,
    pagination?: Pagination
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM Payment";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof PaymentQueries];
        if (value !== null && value !== undefined) {
            if (key === "payment_date") {
                conditions.push(`DATE(${key}) = ?`);
            } else {
                conditions.push(`${key} = ?`);
            }
            queryParams.push(value);
        }
    });

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
    queryParams.push("payment_date");

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page! - 1) * limit!;
        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", ...queryParams];
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return {
        payments: payments as Payment[],
        total: totalCount[0].total as number,
    };
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "payment_id", id];
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
};

const findByBookingId = async (
    booking_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "booking_id", booking_id];
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
};

const findByTransactionId = async (
    transaction_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "payment_id",
        "booking_id",
        "transaction_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
    ];
    const values = [columns, "Payment", "transaction_id", transaction_id];
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments[0] as Payment;
};

const create = async (payment: Payment, connection: PoolConnection) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Payment", payment];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const updateByTransactionId = async (
    payment: Payment,
    connection: PoolConnection
) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = [
        "Payment",
        payment,
        "transaction_id",
        payment.transaction_id,
    ];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    find,
    findById,
    findByBookingId,
    findByTransactionId,
    create,
    updateByTransactionId,
};
