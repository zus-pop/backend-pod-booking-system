import { pool } from "../config/pool.ts";
import { Product } from "../types/type.ts";

const connection = await pool.getConnection();
const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const colum = ["product_id", "product_name", "price", "stock"];
    const values = [colum, "Product"];
    const [product] = await connection.query<Product[]>(sql, values);
    return product;
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colum = ["product_id", "product_name", "price", "stock"];
    const values = [colum, "Product", "product_id", id];
    const [product] = await connection.query<Product[]>(sql, values);
    return product[0];
};

export default {
    findAll,
    findById,
};
