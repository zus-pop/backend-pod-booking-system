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

const createNewProduct = async (product: Product) => {
  const sql =
    "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)";

  const table = "Product";
  const columns = [
    "product_name",
    "category_id",
    "image",
    "description",
    "price",
    "store_id",
    "stock",
  ];

  const values = [
    product.product_name,
    product.category_id,
    product.image,
    product.description,
    product.price,
    product.store_id,
    product.stock,
  ];

  const [result]: any = await connection.query(sql, [
    table,
    ...columns,
    ...values,
  ]);

  return result.insertId;
};

export default {
  findAll,
  findById,
  createNewProduct,
};
