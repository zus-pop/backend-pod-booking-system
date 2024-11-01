import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, Store, StoreQueries } from "../types/type.ts";

const find = async (
  filters: StoreQueries,
  pagination: Pagination,
  connection: PoolConnection
) => {
  const conditions: string[] = [];
  const queryParams: any[] = [];
  let sql = "SELECT ?? FROM ??";
  let countSql = "SELECT COUNT(*) AS total FROM Store";

  Object.keys(filters).forEach((filter) => {
    const key = filter;
    const value = filters[filter as keyof StoreQueries];
    if (value !== null && value !== undefined) {
      switch (key) {
        case "store_name":
          conditions.push(`${key} LIKE ?`);
          queryParams.push(`%${value}%`);
          break;
        case "address":
          conditions.push(`${key} LIKE ?`);
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

  if (pagination) {
    const { page, limit } = pagination;
    const offset = (page! - 1) * limit!;
    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }

  const columns = ["store_id", "store_name", "address", "hotline", "image"];
  const values = [columns, "Store", ...queryParams];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return {
    stores: stores as Store[],
    total: countResult[0].total as number,
  };
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["store_id", "store_name", "address", "hotline", "image"];
  const values = [columns, "Store", "store_id", id];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return stores[0] as Store;
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
): Promise<{ store: Store; revenue: number }[]> => {
  const sql = `
      SELECT s.*, 
             COALESCE(SUM(p.total_cost), 0) AS revenue
      FROM Store s
      LEFT JOIN POD pod ON s.store_id = pod.store_id
      LEFT JOIN Booking b ON pod.pod_id = b.pod_id
      LEFT JOIN Payment p ON b.booking_id = p.booking_id
      GROUP BY s.store_id;
    `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows.map((row) => ({
    store: {
      store_id: row.store_id,
      store_name: row.store_name,
      address: row.address,
      hotline: row.hotline,
      image: row.image,
    },
    revenue: row.revenue,
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
        s.store_id = ?
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
        s.store_id = ?
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
        IFNULL(DATE(p.payment_date), '') AS date,
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
        p.payment_date IS NOT NULL
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
        p.payment_date IS NOT NULL
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
};
