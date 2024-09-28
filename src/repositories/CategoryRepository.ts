import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/pool.ts";
import { Category } from "../types/type.ts";

const connection = await pool.getConnection();
const findAll = async () => {
  const sql = "SELECT ?? FROM ??";
  const colum = ["category_id", "category_name"];
  const values = [colum, "Category"];
  const [category] = await connection.query<RowDataPacket[]>(sql, values);
  return category;
};

const findById = async (id: number) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const colum = ["category_id", "category_name"];
  const values = [colum, "Category", "category_id", id];
  const [category] = await connection.query<RowDataPacket[]>(sql, values);
  return category[0] as Category;
};

const createNewCategory = async (category: Category) => {
  const sql = `INSERT INTO Category SET ?`;

  const values = { category_name: category.category_name };

  const [result] = await connection.query<ResultSetHeader>(sql, values);
  return result.insertId;
};

const updateCategory = async (category: Category) => {
  const sql = `UPDATE Category SET ? WHERE category_id = ?`;

  const values = { category_name: category.category_name };

  const [result] = await connection.query<ResultSetHeader>(sql, [
    values,
    category.category_id,
  ]);
  return result.affectedRows;
};

export default {
  findAll,
  findById,
  createNewCategory,
  updateCategory,
};