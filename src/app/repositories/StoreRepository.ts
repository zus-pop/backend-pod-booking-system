import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, Store, StoreQueries } from "../types/type.ts";

const find = async (
    filters: StoreQueries,
    pagination: Pagination,
    connection: PoolConnection
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = `
        SELECT s.*, COALESCE(AVG(Rating.rating), 0)  AS rating 
        FROM 
        (
        	SELECT u.user_name, p.pod_name, p.store_id, b.rating FROM PODDY.Booking b 
            JOIN PODDY.POD p ON b.pod_id = p.pod_id
            JOIN PODDY.User u ON u.user_id = b.user_id
        ) AS Rating
        RIGHT OUTER JOIN PODDY.Store s ON s.store_id = Rating.store_id
        `;
    let countSql = "SELECT COUNT(DISTINCT s.store_id) AS total FROM Store s";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof StoreQueries];
        if (value !== null && value !== undefined) {
            switch (key) {
                case "store_name":
                    conditions.push(`s.${key} LIKE ?`);
                    queryParams.push(`%${value}%`);
                    break;
                case "address":
                    conditions.push(`s.${key} LIKE ?`);
                    queryParams.push(`%${value}%`);
                    break;
                default:
                    throw new Error(`${key} option is not supported`);
            }
        }
    });

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [countResult] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    sql += " GROUP BY s.store_id";
    sql += " ORDER BY rating DESC, s.store_id ASC";

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page! - 1) * limit!;
        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

    const values = [...queryParams];
    const [stores] = await connection.query<RowDataPacket[]>(sql, values);
    return {
        stores: stores as Store[],
        total: countResult[0].total as number,
    };
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = `
        SELECT s.*, COALESCE(AVG(Rating.rating), 0)  AS rating 
        FROM 
        (
        	SELECT u.user_name, p.pod_name, p.store_id, b.rating FROM PODDY.Booking b 
            JOIN PODDY.POD p ON b.pod_id = p.pod_id
            JOIN PODDY.User u ON u.user_id = b.user_id
        ) AS Rating RIGHT OUTER JOIN PODDY.Store s ON s.store_id = Rating.store_id
        WHERE ?? = ?
        GROUP BY s.store_id
        `;
    const feedbackSql = `
        SELECT u.user_name, p.pod_name, p.store_id, b.rating, b.comment FROM PODDY.Booking b 
        JOIN PODDY.POD p ON b.pod_id = p.pod_id
        JOIN PODDY.User u ON u.user_id = b.user_id
        WHERE ?? = ? AND (b.rating IS NOT NULL OR b.comment IS NOT NULL)
        ORDER BY ??
        LIMIT ? OFFSET ?;
    `;
    const feedbackValues = ["p.store_id", id, "b.rating", 4, 0];
    const [feedbacks] = await connection.query<RowDataPacket[]>(
        feedbackSql,
        feedbackValues
    );
    const values = ["s.store_id", id];
    const [stores] = await connection.query<RowDataPacket[]>(sql, values);
    return {
        ...(stores[0] as Store),
        feedbacks: feedbacks as {
            user_name: string;
            pod_name: string;
            store_id: number;
            rating: number | null;
            comment: string | null;
        }[],
    };
};

const createNewStore = async (store: Store, connection: PoolConnection) => {
    const sql = "INSERT INTO Store SET ?";
    const [result] = await connection.query<ResultSetHeader>(sql, [store]);
    return result.insertId;
};

const updateStore = async (store: Store, connection: PoolConnection) => {
    const sql = "UPDATE Store SET ? WHERE store_id = ?";
    const [result] = await connection.query<ResultSetHeader>(sql, [
        store,
        store.store_id,
    ]);
    return result.affectedRows > 0;
};

const deleteById = async (id: number, connection: PoolConnection) => {
    const sql = "DELETE FROM Store WHERE store_id = ?";
    const values = [id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.affectedRows > 0;
};

const getTotalRevenueByStore = async (
    connection: PoolConnection
): Promise<
    { store_id: number; store_name: string; totalRevenue: number }[]
> => {
    const sql = `
    SELECT 
        s.store_id,
        s.store_name,
        COALESCE(SUM(p.total_cost), 0) AS totalRevenue
    FROM 
        Store s
    LEFT JOIN 
        POD pod ON s.store_id = pod.store_id
    LEFT JOIN 
        Booking b ON pod.pod_id = b.pod_id
    LEFT JOIN 
        Payment p ON b.booking_id = p.booking_id
    WHERE 
        p.payment_status = 'Paid'
    GROUP BY 
        s.store_id, s.store_name
    ORDER BY 
        s.store_id;
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows.map((row) => ({
        store_id: row.store_id,
        store_name: row.store_name,
        totalRevenue: row.totalRevenue,
    }));
};

const getDailyRevenueByStore = async (
    storeId: number,
    connection: PoolConnection
): Promise<{ date: string; daily_revenue: number }[]> => {
    const sql = `
    SELECT 
        DATE(p.payment_date) AS date,
        COALESCE(SUM(p.total_cost), 0) AS daily_revenue
    FROM 
        Store s
    LEFT JOIN 
        POD pod ON s.store_id = pod.store_id
    LEFT JOIN 
        Booking b ON pod.pod_id = b.pod_id
    LEFT JOIN 
        Payment p ON b.booking_id = p.booking_id
    WHERE 
        s.store_id = ? AND p.payment_status = 'Paid'
    GROUP BY 
        DATE(p.payment_date)
    ORDER BY 
        DATE(p.payment_date);
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql, [storeId]);
    return rows.map((row) => ({
        date: row.date,
        daily_revenue: row.daily_revenue,
    }));
};

const getMonthlyRevenueByStore = async (
    storeId: number,
    connection: PoolConnection
): Promise<{ month: string; monthly_revenue: number }[]> => {
    const sql = `
    SELECT 
        DATE_FORMAT(p.payment_date, '%Y-%m') AS month,
        COALESCE(SUM(p.total_cost), 0) AS monthly_revenue
    FROM 
        Store s
    LEFT JOIN 
        POD pod ON s.store_id = pod.store_id
    LEFT JOIN 
        Booking b ON pod.pod_id = b.pod_id
    LEFT JOIN 
        Payment p ON b.booking_id = p.booking_id
    WHERE 
        s.store_id = ? AND p.payment_status = 'Paid'
    GROUP BY 
        DATE_FORMAT(p.payment_date, '%Y-%m')
    ORDER BY 
        DATE_FORMAT(p.payment_date, '%Y-%m');
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql, [storeId]);
    return rows.map((row) => ({
        month: row.month,
        monthly_revenue: row.monthly_revenue,
    }));
};

const getDailyRevenueForAllStores = async (
    connection: PoolConnection
): Promise<{ date: string; daily_revenue: number }[]> => {
    const sql = `
    SELECT 
        DATE(p.payment_date) AS date,
        COALESCE(SUM(p.total_cost), 0) AS daily_revenue
    FROM 
        Store s
    LEFT JOIN 
        POD pod ON s.store_id = pod.store_id
    LEFT JOIN 
        Booking b ON pod.pod_id = b.pod_id
    LEFT JOIN 
        Payment p ON b.booking_id = p.booking_id
    WHERE 
        p.payment_status = 'Paid'
    GROUP BY 
        DATE(p.payment_date)
    ORDER BY 
        DATE(p.payment_date);
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows.map((row) => ({
        date: row.date,
        daily_revenue: row.daily_revenue,
    }));
};

const getMonthlyRevenueForAllStores = async (
    connection: PoolConnection
): Promise<{ month: string; monthly_revenue: number }[]> => {
    const sql = `
    SELECT 
        DATE_FORMAT(p.payment_date, '%Y-%m') AS month,
        COALESCE(SUM(p.total_cost), 0) AS monthly_revenue
    FROM 
        Store s
    LEFT JOIN 
        POD pod ON s.store_id = pod.store_id
    LEFT JOIN 
        Booking b ON pod.pod_id = b.pod_id
    LEFT JOIN 
        Payment p ON b.booking_id = p.booking_id
    WHERE 
        p.payment_status = 'Paid'
    GROUP BY 
        DATE_FORMAT(p.payment_date, '%Y-%m')
    ORDER BY 
        DATE_FORMAT(p.payment_date, '%Y-%m');
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows.map((row) => ({
        month: row.month,
        monthly_revenue: row.monthly_revenue,
    }));
};

const getTotalRevenueForAllStores = async (
    connection: PoolConnection
): Promise<{ totalRevenue: number }> => {
    const sql = `
      SELECT 
          COALESCE(SUM(p.total_cost), 0) AS totalRevenue
      FROM 
          Store s
      LEFT JOIN 
          POD pod ON s.store_id = pod.store_id
      LEFT JOIN 
          Booking b ON pod.pod_id = b.pod_id
      LEFT JOIN 
          Payment p ON b.booking_id = p.booking_id
      WHERE 
          p.payment_status = 'Paid';
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows[0] as { totalRevenue: number };
};

export default {
    find,
    findById,
    createNewStore,
    updateStore,
    deleteById,
    getTotalRevenueByStore,
    getDailyRevenueByStore,
    getMonthlyRevenueByStore,
    getDailyRevenueForAllStores,
    getMonthlyRevenueForAllStores,
    getTotalRevenueForAllStores,
};
