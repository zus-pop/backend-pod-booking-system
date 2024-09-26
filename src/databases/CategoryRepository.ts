import { pool } from "../config/pool.ts";
import { Category } from "../types/type.ts";

const connection = await pool.getConnection();
const findAll = async () => {
  try {
    const sql = "SELECT ?? FROM ??";
    const colum = ["category_id", "category_name"];
    const values = [colum, "Category"];
    const [category] = await connection.query<Category[]>(sql, values);
    return category;
  } catch (err) {
    console.error("error:", err);
    return null;
  }
};

const findById = async (id: number) => {
  try {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colum = ["category_id", "category_name"];
    const values = [colum, "Category", "category_id", id];
    const [category] = await connection.query<Category[]>(sql, values);
    return category[0];
  } catch (err) {
    console.error("error:", err);
    return null;
  }
};

export default {
  findAll,
  findById,
};
