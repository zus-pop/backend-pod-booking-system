import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, Payment, PaymentQueries } from "../types/type.ts";

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
        if (value) {
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
        "zp_trans_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
        "payment_for",
        "refunded_date",
        "refunded_amount",
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
        "zp_trans_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
        "payment_for",
        "refunded_date",
        "refunded_amount",
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
        "zp_trans_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
        "payment_for",
        "refunded_date",
        "refunded_amount"
    ];
    const values = [columns, "Payment", "booking_id", booking_id];
    const [payments] = await connection.query<RowDataPacket[]>(sql, values);
    return payments as Payment[];
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
        "zp_trans_id",
        "total_cost",
        "payment_url",
        "payment_date",
        "payment_status",
        "payment_for",
        "refunded_date",
        "refunded_amount",
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

const updateById = async (payment: Payment, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Payment", payment, "payment_id", payment.payment_id];
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

const getDailyRevenue = async (
    connection: PoolConnection
): Promise<{ date: string; daily_revenue: number }[]> => {
    const sql = `
        SELECT DATE(payment_date) AS date, SUM(total_cost) AS daily_revenue
        FROM Payment
        WHERE payment_status = 'Paid'
        GROUP BY DATE(payment_date);
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows as { date: string; daily_revenue: number }[];
};

const getMonthlyRevenue = async (
    connection: PoolConnection
): Promise<{ year: number; month: number; monthly_revenue: number }[]> => {
    const sql = `
      SELECT YEAR(payment_date) AS year, MONTH(payment_date) AS month, SUM(total_cost) AS monthly_revenue
      FROM Payment
      WHERE payment_status = 'Paid'
      GROUP BY YEAR(payment_date), MONTH(payment_date);
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows as { year: number; month: number; monthly_revenue: number }[];
};

const getTotalRevenue = async (
    connection: PoolConnection
): Promise<{ totalRevenue: number }> => {
    const sql = `
    SELECT 
        COALESCE(SUM(p.total_cost), 0) AS totalRevenue
    FROM 
        Payment p
    WHERE 
        p.payment_status = 'Paid';
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows[0] as { totalRevenue: number };
};

export default {
    find,
    findById,
    findByBookingId,
    findByTransactionId,
    create,
    updateById,
    updateByTransactionId,
    getDailyRevenue,
    getMonthlyRevenue,
    getTotalRevenue,
};
