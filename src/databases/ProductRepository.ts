import { pool } from "../config/pool.ts";
import { Product } from "../types/type.ts";

const connection = await pool.getConnection();
const findAll = async () => {
  try {
    const sql = "SELECT ?? FROM ??";
    const colum = ["product_id", "product_name", "price", "stock"];
    const values = [colum, "Product"];
    const [product] = await connection.query<Product[]>(sql, values);
    return product;
  } catch (err) {
    console.error("error:", err);
    return null;
  }
};

export default {
  findAll,
};
