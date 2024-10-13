import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Product } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const columns = [
    "product_id",
    "product_name",
    "image",
    "description",
    "price",
    "stock",
  ];
  const values = [columns, "Product"];
  const [products] = await connection.query<RowDataPacket[]>(sql, values);
  return products as Product[];
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "product_id",
    "product_name",
    "image",
    "description",
    "price",
    "stock",
  ];
  const values = [columns, "Product", "product_id", id];
  const [product] = await connection.query<RowDataPacket[]>(sql, values);
  return product[0] as Product;
};

const findByMultipleId = async (
  product_ids: number[],
  connection: PoolConnection
) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? IN ( ? )";
  const columns = [
    "product_id",
    "product_name",
    "image",
    "description",
    "price",
    "stock",
  ];
  const values = [columns, "Product", "product_id", product_ids];
  const [products] = await connection.query<RowDataPacket[]>(sql, values);
  return products as Product[];
};

const findByName = async (name: string, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? LIKE ?";
  const columns = [
    "product_id",
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "stock",
  ];
  const values = [columns, "Product", "product_name", `%${name}%`];
  const [products] = await connection.query<RowDataPacket[]>(sql, values);
  return products as Product[];
};

const findByCategory = async (
  category_id: number,
  connection: PoolConnection
) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "product_id",
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "stock",
  ];
  const values = [columns, "Product", "category_id", category_id];
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
  const [result] = await connection.query<ResultSetHeader>(sql, [
    product,
    product.product_id,
  ]);
  return result.affectedRows > 0;
};

const deleteById = async (id: number, connection: PoolConnection) => {
  const sql = "DELETE FROM Product WHERE product_id = ?";
  const values = [id];
  const [result] = await connection.query<ResultSetHeader>(sql, values);
  return result.affectedRows > 0; // Trả về true nếu xóa thành công, ngược lại false
};

export default {
  findAll,
  findById,
  findByMultipleId,
  findByName,
  findByCategory,
  createNewProduct,
  updateProduct,
  deleteById,
};
