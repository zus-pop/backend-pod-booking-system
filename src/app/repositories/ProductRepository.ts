import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Product } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const colum = ["product_id", "product_name", "price", "stock"];
    const values = [colum, "Product"];
    const [product] = await connection.query<RowDataPacket[]>(sql, values);
    return product;
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colum = ["product_id", "product_name", "price", "stock"];
    const values = [colum, "Product", "product_id", id];
    const [product] = await connection.query<RowDataPacket[]>(sql, values);
    return product[0] as Product;
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

export default {
    findAll,
    findById,
    createNewProduct,
    updateProduct,
};
