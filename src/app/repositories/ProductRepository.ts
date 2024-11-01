import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  Category,
  Pagination,
  Product,
  ProductQueries,
  Store,
} from "../types/type.ts";
import CategoryRepository from "./CategoryRepository.ts";
import StoreRepository from "./StoreRepository.ts";

export interface MappingOptions {
  category?: boolean;
  store?: boolean;
}

export interface MappingResponse {
  product_id?: number;
  product_name?: string;
  category?: Category;
  image?: string;
  description?: string;
  price?: number;
  store?: Store;
  stock?: number;
}

const productMapper = async (
  product: Product,
  connection: PoolConnection,
  options?: MappingOptions
) => {
  const mappingResult: MappingResponse = {
    product_id: product.product_id,
    product_name: product.product_name,
    image: product.image,
    description: product.description,
    price: product.price,
    stock: product.stock,
  };

  if (options) {
    if (options.category) {
      const category = await CategoryRepository.findById(
        product.category_id!,
        connection
      );
      mappingResult.category = category;
    }
    if (options.store) {
      const store = await StoreRepository.findById(
        product.store_id!,
        connection
      );
      mappingResult.store = store;
    }
  }

  return mappingResult;
};

const find = async (
  filters: ProductQueries,
  connection: PoolConnection,
  pagination?: Pagination
) => {
  const conditions: string[] = [];
  const queryParams: any[] = [];

  let sql = "SELECT ?? FROM ??";
  let countSql = "SELECT COUNT(*) AS total FROM Product";
  const columns = [
    "product_id",
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "store_id",
    "stock",
  ];

  Object.keys(filters).forEach((filter) => {
    const key = filter;
    const value = filters[filter as keyof ProductQueries];
    if (value !== null && value !== undefined) {
      switch (key) {
        case "product_name":
          conditions.push(`${key} LIKE ?`);
          queryParams.push(`%${value}%`);
          break;
        case "category_id":
          conditions.push(`${key} = ?`);
          queryParams.push(value);
          break;
        case "store_id":
          conditions.push(`${key} = ?`);
          queryParams.push(value);
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

  const [totalCount] = await connection.query<RowDataPacket[]>(
    countSql,
    queryParams
  );

  if (pagination) {
    const { page, limit } = pagination;
    const offset = (page! - 1) * limit!;
    sql += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
  }

  const values = [columns, "Product", ...queryParams];
  const [products] = await connection.query<RowDataPacket[]>(sql, values);
  return {
    products: products as Product[],
    total: totalCount[0].total as number,
  };
};

const findById = async (
  id: number,
  connection: PoolConnection,
  mappingOptions?: MappingOptions
) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "product_id",
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "store_id",
    "stock",
  ];
  const values = [columns, "Product", "product_id", id];
  const [product] = await connection.query<RowDataPacket[]>(sql, values);
  return await productMapper(product[0] as Product, connection, mappingOptions);
};

const findByMultipleId = async (
  product_ids: number[],
  connection: PoolConnection
) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? IN ( ? )";
  const columns = [
    "product_id",
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "store_id",
    "stock",
  ];
  const values = [columns, "Product", "product_id", product_ids];
  const [products] = await connection.query<RowDataPacket[]>(sql, values);
  return products as Product[];
};

const createNewProduct = async (
  product: Product,
  connection: PoolConnection
) => {
  const sql = "INSERT INTO Product SET ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [product]);
  return result.insertId;
};

const updateProduct = async (product: Product, connection: PoolConnection) => {
  const sql = `UPDATE Product SET ? WHERE product_id = ?`;
  const values = [product, [product.product_id]];
  const [result] = await connection.query<ResultSetHeader>(sql, values);
  return result.affectedRows > 0;
};

const deleteById = async (id: number, connection: PoolConnection) => {
  const sql = "DELETE FROM Product WHERE product_id = ?";
  const values = [id];
  const [result] = await connection.query<ResultSetHeader>(sql, values);
  return result.affectedRows > 0;
};

const getTotalRevenueByProduct = async (
  connection: PoolConnection
): Promise<{ product: Product; product_revenue: number }[]> => {
  const sql = `
      SELECT prod.*, 
             COALESCE(SUM(bp.unit_price * bp.quantity), 0) AS product_revenue
      FROM Product prod
      LEFT JOIN Booking_Product bp ON prod.product_id = bp.product_id
      GROUP BY prod.product_id;
    `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows.map((row) => ({
    product: {
      product_id: row.product_id,
      product_name: row.product_name,
      category_id: row.category_id,
      image: row.image,
      description: row.description,
      price: row.price,
      stock: row.stock,
    },
    product_revenue: row.product_revenue,
  }));
};

const getDailyRevenueByProduct = async (
  connection: PoolConnection
): Promise<
  {
    product_id: number;
    product_name: string;
    date: string;
    daily_revenue: number;
  }[]
> => {
  const sql = `
      SELECT 
          p.product_id,
          p.product_name,
          DATE(bp.bought_date) AS date,
          COALESCE(SUM(bp.unit_price * bp.quantity), 0) AS daily_revenue
      FROM 
          Product p
      LEFT JOIN 
          Booking_Product bp ON p.product_id = bp.product_id
      GROUP BY 
          p.product_id, DATE(bp.bought_date)
      ORDER BY 
          DATE(bp.bought_date);
    `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows as {
    product_id: number;
    product_name: string;
    date: string;
    daily_revenue: number;
  }[];
};

const getDailyTotalRevenue = async (
  connection: PoolConnection
): Promise<{ date: string; daily_revenue: number }[]> => {
  const sql = `
      SELECT 
          DATE(bp.bought_date) AS date,
          COALESCE(SUM(bp.unit_price * bp.quantity), 0) AS daily_revenue
      FROM 
          Booking_Product bp
      GROUP BY 
          DATE(bp.bought_date)
      ORDER BY 
          DATE(bp.bought_date);
    `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows as { date: string; daily_revenue: number }[];
};

const getMonthlyRevenueByProduct = async (
  connection: PoolConnection
): Promise<{ month: string; monthly_revenue: number }[]> => {
  const sql = `
    SELECT 
        DATE_FORMAT(bp.bought_date, '%Y-%m') AS month,
        COALESCE(SUM(bp.unit_price * bp.quantity), 0) AS monthly_revenue
    FROM 
        Booking_Product bp
    GROUP BY 
        DATE_FORMAT(bp.bought_date, '%Y-%m')
    ORDER BY 
        DATE_FORMAT(bp.bought_date, '%Y-%m');
  `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows as { month: string; monthly_revenue: number }[];
};

const getTotalProductRevenue = async (
  connection: PoolConnection
): Promise<{ totalAllProductSaled: number }> => {
  const sql = `
    SELECT 
        COALESCE(SUM(bp.unit_price * bp.quantity), 0) AS totalAllProductSaled
    FROM 
        Booking_Product bp;
  `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows[0] as { totalAllProductSaled: number };
};

export default {
  find,
  findById,
  findByMultipleId,
  createNewProduct,
  updateProduct,
  deleteById,
  getTotalRevenueByProduct,
  getDailyRevenueByProduct,
  getDailyTotalRevenue,
  getMonthlyRevenueByProduct,
  getTotalProductRevenue,
};
