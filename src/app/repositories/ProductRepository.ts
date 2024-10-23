import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, Product, ProductQueries } from "../types/type.ts";

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
    console.log(connection.format(sql, values));
    const [products] = await connection.query<RowDataPacket[]>(sql, values);
    return {
        products: products as Product[],
        total: totalCount[0].total as number,
    };
};

const findById = async (id: number, connection: PoolConnection) => {
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
        "category_id",
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
    return result.affectedRows > 0;
};

export default {
    find,
    findById,
    findByMultipleId,
    findByName,
    findByCategory,
    createNewProduct,
    updateProduct,
    deleteById,
};
