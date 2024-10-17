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

    const { page, limit } = pagination;
    const offset = (page! - 1) * limit!;
    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const columns = ["store_id", "store_name", "address", "hotline", "image"];
    const values = [columns, "Store", ...queryParams];
    console.log(connection.format(sql, values));
    console.log(connection.format(countSql, queryParams));
    const [stores] = await connection.query<RowDataPacket[]>(sql, values);
    const [countResult] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );
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

export default {
    find,
    findById,
    createNewStore,
    updateStore,
    deleteById,
};
